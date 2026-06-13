import { getPool, query } from "../config/db.js";
import { serializeOrder, serializeOrderItem } from "../utils/serializers.js";
import { ORDER_STATUSES, PAYMENT_METHODS } from "../utils/constants.js";

const orderNumber = () => `CC-${Math.floor(100000 + Math.random() * 900000)}`;

const orderSelect = `
  SELECT
    o.*,
    u.name AS user_name,
    u.email AS user_email,
    v.name AS vendor_name
  FROM orders o
  JOIN users u ON u.id = o.user_id
  JOIN vendors v ON v.id = o.vendor_id
`;

export const checkout = async (req, res) => {
  const { paymentMethod, notes } = req.body;
  if (!PAYMENT_METHODS.includes(paymentMethod)) return res.status(400).json({ message: "Invalid payment method" });

  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const cartItems = await query(
      `SELECT ci.*, p.vendor_id, p.name, p.price, p.quantity AS available_quantity, p.sales_count, p.stock_status, p.status
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?`,
      [req.user._id],
      connection
    );

    if (!cartItems.length) throw new Error("Cart is empty");

    const settingsRows = await query("SELECT value FROM settings WHERE key_name = 'delivery_fee' LIMIT 1", [], connection);
    const deliveryFee = Number(settingsRows[0]?.value || 30);
    const cartByVendor = cartItems.reduce((acc, item) => {
      const key = String(item.vendor_id);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    const createdOrderIds = [];

    for (const [vendorId, items] of Object.entries(cartByVendor)) {
      const vendorRows = await query("SELECT * FROM vendors WHERE id = ? LIMIT 1", [vendorId], connection);
      const vendor = vendorRows[0];
      if (!vendor || vendor.status !== "approved") throw new Error("Vendor unavailable");

      let subtotal = 0;
      for (const item of items) {
        if (item.status !== "active" || item.available_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }
        subtotal += Number(item.price) * item.quantity;
      }

      const total = subtotal + deliveryFee;

      const [orderResult] = await connection.execute(
        `INSERT INTO orders (
          user_id, vendor_id, order_number, subtotal, delivery_fee, total,
          payment_method, payment_status, order_status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
        [
          req.user._id,
          vendorId,
          orderNumber(),
          subtotal,
          deliveryFee,
          total,
          paymentMethod,
          paymentMethod === "Cash on Delivery" ? "unpaid" : "pending",
          notes || null
        ]
      );

      for (const item of items) {
        const nextQuantity = item.available_quantity - item.quantity;
        const nextStockStatus = nextQuantity <= 0 ? "out_of_stock" : nextQuantity <= 5 ? "low_stock" : "in_stock";

        await connection.execute(
          `UPDATE products
           SET quantity = ?, sales_count = sales_count + ?, stock_status = ?
           WHERE id = ?`,
          [nextQuantity, item.quantity, nextStockStatus, item.product_id]
        );

        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, total)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orderResult.insertId, item.product_id, item.name, item.quantity, item.price, Number(item.price) * item.quantity]
        );
      }

      await connection.execute(
        `INSERT INTO payments (order_id, user_id, amount, method, status, transaction_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderResult.insertId,
          req.user._id,
          total,
          paymentMethod,
          paymentMethod === "Cash on Delivery" ? "pending" : "paid",
          paymentMethod === "Cash on Delivery" ? null : `TX-${Date.now()}-${orderResult.insertId}`
        ]
      );

      createdOrderIds.push(orderResult.insertId);
    }

    await connection.execute("DELETE FROM cart_items WHERE user_id = ?", [req.user._id]);
    await connection.commit();
    const orders = [];
    for (const orderId of createdOrderIds) {
      const orderRows = await query(`${orderSelect} WHERE o.id = ? LIMIT 1`, [orderId]);
      if (orderRows[0]) orders.push(serializeOrder(orderRows[0]));
    }

    if (orders.length === 1) {
      return res.status(201).json(orders[0]);
    }

    return res.status(201).json({
      _id: orders[0]?._id || null,
      orderIds: orders.map((o) => o._id),
      orders,
      message: "Multiple orders placed successfully."
    });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message || "Checkout failed" });
  } finally {
    connection.release();
  }
};

export const getMyOrders = async (req, res) => {
  let sql = `${orderSelect} ORDER BY o.created_at DESC`;
  let params = [];

  if (req.user.role === "student") {
    sql = `${orderSelect} WHERE o.user_id = ? ORDER BY o.created_at DESC`;
    params = [req.user._id];
  } else if (req.user.role === "vendor") {
    const vendorRows = await query("SELECT id FROM vendors WHERE user_id = ? LIMIT 1", [req.user._id]);
    const vendorId = vendorRows[0]?.id || 0;
    sql = `${orderSelect} WHERE o.vendor_id = ? ORDER BY o.created_at DESC`;
    params = [vendorId];
  }

  const rows = await query(sql, params);
  res.json(rows.map(serializeOrder));
};

export const getOrderById = async (req, res) => {
  const orderRows = await query(`${orderSelect} WHERE o.id = ? LIMIT 1`, [req.params.id]);
  const orderRow = orderRows[0];
  if (!orderRow) return res.status(404).json({ message: "Order not found" });

  if (req.user.role === "student" && String(orderRow.user_id) !== String(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.user.role === "vendor") {
    const vendorRows = await query("SELECT id FROM vendors WHERE user_id = ? LIMIT 1", [req.user._id]);
    const vendorId = vendorRows[0]?.id;
    if (!vendorId || String(orderRow.vendor_id) !== String(vendorId)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  const itemRows = await query("SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC", [req.params.id]);
  res.json({ order: serializeOrder(orderRow), items: itemRows.map(serializeOrderItem) });
};

export const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  if (!ORDER_STATUSES.includes(orderStatus)) return res.status(400).json({ message: "Invalid order status" });

  const orderRows = await query("SELECT * FROM orders WHERE id = ? LIMIT 1", [req.params.id]);
  const order = orderRows[0];
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (req.user.role === "vendor") {
    const vendorRows = await query("SELECT id FROM vendors WHERE user_id = ? LIMIT 1", [req.user._id]);
    const vendorId = vendorRows[0]?.id;
    if (!vendorId || String(vendorId) !== String(order.vendor_id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  const paymentStatus =
    orderStatus === "delivered" && order.payment_method !== "Cash on Delivery"
      ? "paid"
      : order.payment_status;

  await query("UPDATE orders SET order_status = ?, payment_status = ? WHERE id = ?", [orderStatus, paymentStatus, req.params.id]);
  const rows = await query(`${orderSelect} WHERE o.id = ? LIMIT 1`, [req.params.id]);
  res.json(serializeOrder(rows[0]));
};

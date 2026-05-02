import { query } from "../config/db.js";
import { serializeProduct } from "../utils/serializers.js";

const cartSelect = `
  SELECT
    ci.id,
    ci.user_id,
    ci.product_id,
    ci.quantity AS cart_quantity,
    ci.created_at,
    ci.updated_at,
    p.id AS product_row_id,
    p.vendor_id,
    p.category_id,
    p.name,
    p.description,
    p.price,
    p.stock_status,
    p.quantity AS product_quantity,
    p.sales_count,
    p.status AS product_status,
    p.created_at AS product_created_at,
    p.updated_at AS product_updated_at,
    v.name AS vendor_name,
    v.type AS vendor_type,
    v.description AS vendor_description,
    c.name AS category_name,
    c.slug AS category_slug
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  JOIN vendors v ON v.id = p.vendor_id
  JOIN categories c ON c.id = p.category_id
`;

export const getCart = async (req, res) => {
  const rows = await query(`${cartSelect} WHERE ci.user_id = ? ORDER BY ci.created_at DESC`, [req.user._id]);
  const cart = rows.map((row) => ({
    _id: String(row.id),
    userId: String(row.user_id),
    productId: serializeProduct({
      id: row.product_row_id,
      vendor_id: row.vendor_id,
      category_id: row.category_id,
      name: row.name,
      description: row.description,
      price: row.price,
      stock_status: row.stock_status,
      quantity: row.product_quantity,
      sales_count: row.sales_count,
      status: row.product_status,
      created_at: row.product_created_at,
      updated_at: row.product_updated_at,
      vendor_name: row.vendor_name,
      vendor_type: row.vendor_type,
      vendor_description: row.vendor_description,
      category_name: row.category_name,
      category_slug: row.category_slug
    }),
    quantity: row.cart_quantity,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
  res.json(cart);
};

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const productRows = await query("SELECT * FROM products WHERE id = ? AND status = 'active' LIMIT 1", [productId]);
  if (!productRows[0]) return res.status(404).json({ message: "Product not found" });

  await query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), updated_at = CURRENT_TIMESTAMP`,
    [req.user._id, productId, quantity]
  );

  const rows = await query("SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? LIMIT 1", [req.user._id, productId]);
  const item = rows[0];
  res.status(201).json({
    _id: String(item.id),
    userId: String(item.user_id),
    productId: String(item.product_id),
    quantity: item.quantity,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  });
};

export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  await query("UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?", [quantity, req.params.id, req.user._id]);
  const rows = await query("SELECT * FROM cart_items WHERE id = ? AND user_id = ? LIMIT 1", [req.params.id, req.user._id]);
  const item = rows[0];
  if (!item) return res.status(404).json({ message: "Cart item not found" });
  res.json({
    _id: String(item.id),
    userId: String(item.user_id),
    productId: String(item.product_id),
    quantity: item.quantity,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  });
};

export const removeCartItem = async (req, res) => {
  await query("DELETE FROM cart_items WHERE id = ? AND user_id = ?", [req.params.id, req.user._id]);
  res.json({ message: "Removed" });
};

import { query } from "../config/db.js";
import { serializeSubscription } from "../utils/serializers.js";

const subscriptionSelect = `
  SELECT
    s.*,
    u.name AS user_name,
    v.name AS vendor_name,
    p.name AS product_name
  FROM subscriptions s
  JOIN users u ON u.id = s.user_id
  JOIN vendors v ON v.id = s.vendor_id
  JOIN products p ON p.id = s.product_id
`;

export const getSubscriptions = async (req, res) => {
  const params = [];
  let whereClause = "";

  if (req.user.role === "student") {
    whereClause = "WHERE s.user_id = ?";
    params.push(req.user._id);
  }

  const rows = await query(`${subscriptionSelect} ${whereClause} ORDER BY s.created_at DESC`, params);
  res.json(rows.map(serializeSubscription));
};

export const createSubscription = async (req, res) => {
  const { productId, frequency, quantity, nextOrderDate } = req.body;
  const productRows = await query("SELECT * FROM products WHERE id = ? LIMIT 1", [productId]);
  const product = productRows[0];
  if (!product) return res.status(404).json({ message: "Product not found" });

  const result = await query(
    `INSERT INTO subscriptions (user_id, vendor_id, product_id, frequency, quantity, next_order_date, status)
     VALUES (?, ?, ?, ?, ?, ?, 'active')`,
    [req.user._id, product.vendor_id, productId, frequency, quantity, nextOrderDate]
  );

  const rows = await query(`${subscriptionSelect} WHERE s.id = ? LIMIT 1`, [result.insertId]);
  res.status(201).json(serializeSubscription(rows[0]));
};

export const deleteSubscription = async (req, res) => {
  await query("DELETE FROM subscriptions WHERE id = ? AND user_id = ?", [req.params.id, req.user._id]);
  res.json({ message: "Subscription removed" });
};

import { query } from "../config/db.js";

const countValue = async (sql, params = []) => {
  const rows = await query(sql, params);
  return Number(rows[0]?.total || 0);
};

export const adminStats = async (_req, res) => {
  const [students, vendors, products, orders, categories, subscriptions, revenue] = await Promise.all([
    countValue("SELECT COUNT(*) AS total FROM users WHERE role = 'student'"),
    countValue("SELECT COUNT(*) AS total FROM vendors"),
    countValue("SELECT COUNT(*) AS total FROM products"),
    countValue("SELECT COUNT(*) AS total FROM orders"),
    countValue("SELECT COUNT(*) AS total FROM categories"),
    countValue("SELECT COUNT(*) AS total FROM subscriptions"),
    countValue("SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE order_status = 'delivered'")
  ]);

  res.json({ students, vendors, products, orders, categories, subscriptions, revenue });
};

export const vendorStats = async (req, res) => {
  const vendorRows = await query("SELECT * FROM vendors WHERE user_id = ? LIMIT 1", [req.user._id]);
  const vendor = vendorRows[0];
  if (!vendor) return res.status(404).json({ message: "Vendor profile not found" });

  const [totalOrders, pendingOrders, deliveredOrders, revenue] = await Promise.all([
    countValue("SELECT COUNT(*) AS total FROM orders WHERE vendor_id = ?", [vendor.id]),
    countValue("SELECT COUNT(*) AS total FROM orders WHERE vendor_id = ? AND order_status = 'pending'", [vendor.id]),
    countValue("SELECT COUNT(*) AS total FROM orders WHERE vendor_id = ? AND order_status = 'delivered'", [vendor.id]),
    countValue("SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE vendor_id = ? AND order_status = 'delivered'", [vendor.id])
  ]);

  res.json({ totalOrders, pendingOrders, deliveredOrders, revenue });
};

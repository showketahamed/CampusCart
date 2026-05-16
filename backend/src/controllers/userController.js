import { query } from "../config/db.js";
import { serializeUser, serializeVendor } from "../utils/serializers.js";

export const listUsers = async (_req, res) => {
  const rows = await query("SELECT * FROM users ORDER BY created_at DESC");
  res.json(rows.map(serializeUser));
};

export const updateUserStatus = async (req, res) => {
  const { status } = req.body;
  await query("UPDATE users SET status = ? WHERE id = ?", [status, req.params.id]);
  const rows = await query("SELECT * FROM users WHERE id = ? LIMIT 1", [req.params.id]);
  res.json(serializeUser(rows[0]));
};

export const listVendors = async (_req, res) => {
  const rows = await query(
    `SELECT
      v.*,
      u.id AS user_id,
      u.name AS user_name,
      u.email AS user_email,
      u.status AS user_status,
      u.role AS user_role
     FROM vendors v
     JOIN users u ON u.id = v.user_id
     ORDER BY v.created_at DESC`
  );
  res.json(rows.map((row) => serializeVendor(row)));
};

export const updateVendorStatus = async (req, res) => {
  const { status } = req.body;
  await query("UPDATE vendors SET status = ? WHERE id = ?", [status, req.params.id]);

  const rows = await query("SELECT * FROM vendors WHERE id = ? LIMIT 1", [req.params.id]);
  const vendor = rows[0];
  if (vendor) {
    await query("UPDATE users SET status = ? WHERE id = ?", [status === "blocked" ? "blocked" : "active", vendor.user_id]);
  }

  const refreshed = await query("SELECT * FROM vendors WHERE id = ? LIMIT 1", [req.params.id]);
  res.json(serializeVendor(refreshed[0]));
};

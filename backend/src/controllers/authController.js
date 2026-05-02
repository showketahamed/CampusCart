import bcrypt from "bcryptjs";
import { getPool, query } from "../config/db.js";
import { serializeUser, serializeVendor } from "../utils/serializers.js";
import { signToken } from "../utils/token.js";

export const register = async (req, res) => {
  const { name, email, password, role = "student", phone, studentId, vendorName, vendorType, vendorDescription } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "name, email, password required" });

  const existing = await query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  if (existing[0]) return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [userResult] = await connection.execute(
      `INSERT INTO users (name, email, password, role, phone, student_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role, phone || null, role === "student" ? studentId || null : null, role === "vendor" ? "pending" : "active"]
    );

    if (role === "vendor") {
      await connection.execute(
        `INSERT INTO vendors (user_id, name, type, description, email, phone, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [userResult.insertId, vendorName || name, vendorType || "general", vendorDescription || null, email, phone || null]
      );
      await connection.commit();
      return res.status(201).json({ message: "Vendor registration submitted. Await admin approval." });
    }

    await connection.commit();
    const rows = await query("SELECT * FROM users WHERE id = ? LIMIT 1", [userResult.insertId]);
    const user = serializeUser(rows[0]);
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const rows = await query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  const row = rows[0];
  if (!row) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, row.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });
  if (row.status === "blocked") return res.status(403).json({ message: "Account blocked" });

  if (row.role === "vendor") {
    const vendorRows = await query("SELECT * FROM vendors WHERE user_id = ? LIMIT 1", [row.id]);
    const vendor = vendorRows[0];
    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({ message: "Vendor not approved yet" });
    }
  }

  const user = serializeUser(row);
  const token = signToken(user);
  res.json({ token, user });
};

export const me = async (req, res) => {
  let vendor = null;
  if (req.user.role === "vendor") {
    const vendorRows = await query("SELECT * FROM vendors WHERE user_id = ? LIMIT 1", [req.user._id]);
    if (vendorRows[0]) vendor = serializeVendor(vendorRows[0], req.user);
  }
  res.json({ user: req.user, vendor });
};

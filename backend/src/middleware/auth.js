import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { serializeUser } from "../utils/serializers.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const rows = await query("SELECT * FROM users WHERE id = ? LIMIT 1", [payload.id]);
    const row = rows[0];

    if (!row) return res.status(401).json({ message: "Invalid token user" });
    if (row.status === "blocked") return res.status(403).json({ message: "Account blocked" });

    req.user = serializeUser(row);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

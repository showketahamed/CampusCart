import { query } from "../config/db.js";
import { serializeUser, serializeVendor } from "../utils/serializers.js";

export const updateProfile = async (req, res) => {
  const { name, phone, studentId, vendorName, vendorDescription, vendorPhone } = req.body;
  const userRows = await query("SELECT * FROM users WHERE id = ? LIMIT 1", [req.user._id]);
  const user = userRows[0];
  if (!user) return res.status(404).json({ message: "User not found" });

  await query(
    "UPDATE users SET name = ?, phone = ?, student_id = ? WHERE id = ?",
    [name ?? user.name, phone ?? user.phone, user.role === "student" ? studentId ?? user.student_id : user.student_id, req.user._id]
  );

  let vendor = null;
  if (user.role === "vendor") {
    const vendorRows = await query("SELECT * FROM vendors WHERE user_id = ? LIMIT 1", [req.user._id]);
    const vendorRow = vendorRows[0];
    if (vendorRow) {
      await query(
        "UPDATE vendors SET name = ?, description = ?, phone = ? WHERE id = ?",
        [vendorName ?? vendorRow.name, vendorDescription ?? vendorRow.description, vendorPhone ?? vendorRow.phone, vendorRow.id]
      );
      const refreshedVendor = await query("SELECT * FROM vendors WHERE id = ? LIMIT 1", [vendorRow.id]);
      vendor = serializeVendor(refreshedVendor[0], req.user);
    }
  }

  const refreshedUser = await query("SELECT * FROM users WHERE id = ? LIMIT 1", [req.user._id]);
  res.json({ user: serializeUser(refreshedUser[0]), vendor });
};

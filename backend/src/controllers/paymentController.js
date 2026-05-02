import { query } from "../config/db.js";
import { serializePayment } from "../utils/serializers.js";

export const getPayments = async (req, res) => {
  const params = [];
  let whereClause = "";

  if (req.user.role === "student") {
    whereClause = "WHERE p.user_id = ?";
    params.push(req.user._id);
  }

  const rows = await query(
    `SELECT p.*, o.order_number, o.total AS order_total
     FROM payments p
     JOIN orders o ON o.id = p.order_id
     ${whereClause}
     ORDER BY p.created_at DESC`,
    params
  );

  res.json(rows.map(serializePayment));
};

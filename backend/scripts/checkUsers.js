import { connectDB } from "../src/config/db.js";

const checkUsers = async () => {
  const pool = await connectDB();
  const [rows] = await pool.query("SELECT id, name, email, role FROM users");
  console.log("Users in DB:", rows);
  process.exit(0);
};

checkUsers();

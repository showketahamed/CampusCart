import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { closeDB, connectDB } from "../src/config/db.js";

dotenv.config();

const createAdmin = async () => {
  const pool = await connectDB();
  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE email = 'admin@campuscart.com'");
    if (existing.length > 0) {
      console.log("Admin user already exists. Updating password to admin123...");
      const adminPassword = await bcrypt.hash("admin123", 10);
      await pool.query("UPDATE users SET password = ? WHERE email = 'admin@campuscart.com'", [adminPassword]);
      console.log("Password updated.");
    } else {
      console.log("Creating admin user...");
      const adminPassword = await bcrypt.hash("admin123", 10);
      await pool.query(
        `INSERT INTO users (name, email, password, role, status)
         VALUES ('CampusCart Admin', 'admin@campuscart.com', ?, 'admin', 'active')`,
        [adminPassword]
      );
      console.log("Admin user created.");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await closeDB();
    process.exit(0);
  }
};

createAdmin();

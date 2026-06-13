import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { closeDB, connectDB, getPool } from "../src/config/db.js";

dotenv.config();

const vendorsData = [
  ["Campus Cafe", "food", "cafe@vendor.com"],
  ["Fresh Bites", "food", "freshbites@vendor.com"],
  ["Style Hub", "clothing", "stylehub@vendor.com"],
  ["Fashion Point", "clothing", "fashionpoint@vendor.com"],
  ["Tech Accessories", "accessories", "techaccess@vendor.com"],
  ["Craft Corner", "handmade", "craftcorner@vendor.com"],
  ["Book Haven", "books", "bookhaven@vendor.com"],
  ["Campus Electronics", "electronics", "electronics@vendor.com"]
];

const catalog = {
  food: ["Burger Combo", "Pizza Margherita", "Pasta Alfredo", "Chicken Wings", "Caesar Salad", "Chocolate Cake"],
  clothing: ["T-Shirt", "Jeans", "Hoodie", "Sneakers", "Cap", "Shirt", "Dress", "Jacket"],
  accessories: ["Phone Case", "USB Cable", "Power Bank", "Earphones", "Screen Protector", "Laptop Stand"],
  handmade: ["Handmade Bracelet", "Custom Keychain", "Wall Art", "Greeting Card", "Notebook Cover"],
  books: ["Engineering Book", "Novel", "Notebook Set", "Pen Pack", "Calculator"],
  electronics: ["Wireless Mouse", "Keyboard", "Webcam", "USB Drive", "Headset", "LED Lamp"]
};

const seed = async () => {
  await connectDB();
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    for (const table of ["payments", "order_items", "orders", "cart_items", "subscriptions", "products", "vendors", "categories", "settings", "users"]) {
      await connection.query(`TRUNCATE TABLE ${table}`);
    }
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    const adminPassword = await bcrypt.hash("admin123", 10);
    const studentPassword = await bcrypt.hash("student123", 10);
    const vendorPassword = await bcrypt.hash("vendor123", 10);

    const [adminResult] = await connection.execute(
      `INSERT INTO users (name, email, password, role, status)
       VALUES ('CampusCart Admin', 'admin@campuscart.com', ?, 'admin', 'active')`,
      [adminPassword]
    );

    const [studentResult] = await connection.execute(
      `INSERT INTO users (name, email, password, role, student_id, status)
       VALUES ('Campus Student', 'student@campuscart.com', ?, 'student', 'STU-1001', 'active')`,
      [studentPassword]
    );

    const categories = {};
    for (const slug of ["food", "clothing", "accessories", "handmade", "books", "electronics"]) {
      const name = slug.charAt(0).toUpperCase() + slug.slice(1);
      const [result] = await connection.execute(
        "INSERT INTO categories (name, slug, type) VALUES (?, ?, 'marketplace')",
        [name, slug]
      );
      categories[slug] = result.insertId;
    }

    for (const [name, type, email] of vendorsData) {
      const [userResult] = await connection.execute(
        `INSERT INTO users (name, email, password, role, status)
         VALUES (?, ?, ?, 'vendor', 'active')`,
        [name, email, vendorPassword]
      );

      const [vendorResult] = await connection.execute(
        `INSERT INTO vendors (user_id, name, type, description, email, status)
         VALUES (?, ?, ?, ?, ?, 'approved')`,
        [userResult.insertId, name, type, `${name} shop for campus students.`, email]
      );

      for (const [index, productName] of catalog[type].entries()) {
        await connection.execute(
          `INSERT INTO products (
            vendor_id, category_id, name, description, price, stock_status, quantity, sales_count, status
          ) VALUES (?, ?, ?, ?, ?, 'in_stock', ?, 0, 'active')`,
          [vendorResult.insertId, categories[type], productName, `${productName} from ${name}`, 5 + index + vendorResult.insertId, 20 + index * 2]
        );
      }
    }

    await connection.execute(
      `INSERT INTO settings (key_name, label, value, group_name)
       VALUES ('delivery_fee', 'Default Delivery Fee', '30', 'orders')`
    );

    await connection.commit();

    console.log("Seed complete");
    console.log("Admin: admin@campuscart.com / admin123");
    console.log("Student: student@campuscart.com / student123");
    console.log(`Inserted admin user id ${adminResult.insertId} and student user id ${studentResult.insertId}`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await closeDB();
  }
};

seed().catch(async (error) => {
  console.error(error);
  await closeDB();
  process.exit(1);
});

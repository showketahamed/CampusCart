import { query } from "../config/db.js";
import { serializeProduct, serializeVendor } from "../utils/serializers.js";

const productSelect = `
  SELECT
    p.*,
    v.name AS vendor_name,
    v.type AS vendor_type,
    v.description AS vendor_description,
    c.name AS category_name,
    c.slug AS category_slug
  FROM products p
  JOIN vendors v ON v.id = p.vendor_id
  JOIN categories c ON c.id = p.category_id
`;

export const getProducts = async (req, res) => {
  const { search = "", categoryId, vendorId } = req.query;
  const conditions = ["p.status = 'active'", "p.name LIKE ?"];
  const params = [`%${search}%`];

  if (categoryId) {
    conditions.push("p.category_id = ?");
    params.push(categoryId);
  }
  if (vendorId) {
    conditions.push("p.vendor_id = ?");
    params.push(vendorId);
  }

  const rows = await query(`${productSelect} WHERE ${conditions.join(" AND ")} ORDER BY p.created_at DESC`, params);
  res.json(rows.map(serializeProduct));
};

export const getProductById = async (req, res) => {
  const rows = await query(`${productSelect} WHERE p.id = ? LIMIT 1`, [req.params.id]);
  const row = rows[0];
  if (!row) return res.status(404).json({ message: "Product not found" });
  res.json(serializeProduct(row));
};

export const createProduct = async (req, res) => {
  const vendorRows = await query("SELECT * FROM vendors WHERE user_id = ? LIMIT 1", [req.user._id]);
  const vendor = vendorRows[0];
  if (!vendor) return res.status(404).json({ message: "Vendor profile not found" });

  const { categoryId, name, description, price, stockStatus = "in_stock", quantity = 1, salesCount = 0, status = "active" } = req.body;
  const result = await query(
    `INSERT INTO products (vendor_id, category_id, name, description, price, stock_status, quantity, sales_count, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [vendor.id, categoryId, name, description || null, price, stockStatus, quantity, salesCount, status]
  );

  const rows = await query(`${productSelect} WHERE p.id = ? LIMIT 1`, [result.insertId]);
  res.status(201).json(serializeProduct(rows[0]));
};

export const updateProduct = async (req, res) => {
  const productRows = await query("SELECT * FROM products WHERE id = ? LIMIT 1", [req.params.id]);
  const product = productRows[0];
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.user.role === "vendor") {
    const vendorRows = await query("SELECT * FROM vendors WHERE user_id = ? LIMIT 1", [req.user._id]);
    const vendor = vendorRows[0];
    if (!vendor || String(product.vendor_id) !== String(vendor.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  const next = {
    categoryId: req.body.categoryId ?? product.category_id,
    name: req.body.name ?? product.name,
    description: req.body.description ?? product.description,
    price: req.body.price ?? product.price,
    stockStatus: req.body.stockStatus ?? product.stock_status,
    quantity: req.body.quantity ?? product.quantity,
    salesCount: req.body.salesCount ?? product.sales_count,
    status: req.body.status ?? product.status
  };

  await query(
    `UPDATE products
     SET category_id = ?, name = ?, description = ?, price = ?, stock_status = ?, quantity = ?, sales_count = ?, status = ?
     WHERE id = ?`,
    [next.categoryId, next.name, next.description, next.price, next.stockStatus, next.quantity, next.salesCount, next.status, req.params.id]
  );

  const rows = await query(`${productSelect} WHERE p.id = ? LIMIT 1`, [req.params.id]);
  res.json(serializeProduct(rows[0]));
};

export const deleteProduct = async (req, res) => {
  const productRows = await query("SELECT * FROM products WHERE id = ? LIMIT 1", [req.params.id]);
  const product = productRows[0];
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.user.role === "vendor") {
    const vendorRows = await query("SELECT * FROM vendors WHERE user_id = ? LIMIT 1", [req.user._id]);
    const vendor = vendorRows[0];
    if (!vendor || String(product.vendor_id) !== String(vendor.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  await query("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.json({ message: "Product deleted" });
};

export const getVendors = async (_req, res) => {
  const rows = await query("SELECT * FROM vendors WHERE status = 'approved' ORDER BY created_at DESC");
  res.json(rows.map((row) => serializeVendor(row)));
};

export const getMyProducts = async (req, res) => {
  if (req.user.role === "admin") {
    const rows = await query(`${productSelect} ORDER BY p.created_at DESC`);
    return res.json(rows.map(serializeProduct));
  }

  const vendorRows = await query("SELECT * FROM vendors WHERE user_id = ? LIMIT 1", [req.user._id]);
  const vendor = vendorRows[0];
  if (!vendor) return res.status(404).json({ message: "Vendor profile not found" });

  const rows = await query(`${productSelect} WHERE p.vendor_id = ? ORDER BY p.created_at DESC`, [vendor.id]);
  res.json(rows.map(serializeProduct));
};

import { query } from "../config/db.js";
import { serializeCategory } from "../utils/serializers.js";

export const getCategories = async (_req, res) => {
  const rows = await query("SELECT * FROM categories ORDER BY name ASC");
  res.json(rows.map(serializeCategory));
};

export const createCategory = async (req, res) => {
  const { name, slug, type = "marketplace" } = req.body;
  const result = await query("INSERT INTO categories (name, slug, type) VALUES (?, ?, ?)", [name, slug, type]);
  const rows = await query("SELECT * FROM categories WHERE id = ? LIMIT 1", [result.insertId]);
  res.status(201).json(serializeCategory(rows[0]));
};

export const updateCategory = async (req, res) => {
  const { name, slug, type } = req.body;
  await query("UPDATE categories SET name = COALESCE(?, name), slug = COALESCE(?, slug), type = COALESCE(?, type) WHERE id = ?", [name ?? null, slug ?? null, type ?? null, req.params.id]);
  const rows = await query("SELECT * FROM categories WHERE id = ? LIMIT 1", [req.params.id]);
  res.json(serializeCategory(rows[0]));
};

export const deleteCategory = async (req, res) => {
  await query("DELETE FROM categories WHERE id = ?", [req.params.id]);
  res.json({ message: "Category deleted" });
};

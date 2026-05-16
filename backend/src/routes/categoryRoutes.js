import { Router } from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { authMiddleware, allowRoles } from "../middleware/auth.js";

const router = Router();
router.get("/", getCategories);
router.post("/", authMiddleware, allowRoles("admin"), createCategory);
router.put("/:id", authMiddleware, allowRoles("admin"), updateCategory);
router.delete("/:id", authMiddleware, allowRoles("admin"), deleteCategory);

export default router;

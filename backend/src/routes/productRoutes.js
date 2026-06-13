import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getVendors, getMyProducts } from "../controllers/productController.js";
import { authMiddleware, allowRoles } from "../middleware/auth.js";

const router = Router();
router.get("/", getProducts);
router.get("/vendors", getVendors);
router.get("/my", authMiddleware, allowRoles("vendor", "admin"), getMyProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, allowRoles("vendor", "admin"), createProduct);
router.put("/:id", authMiddleware, allowRoles("vendor", "admin"), updateProduct);
router.delete("/:id", authMiddleware, allowRoles("vendor", "admin"), deleteProduct);

export default router;

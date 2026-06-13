import { Router } from "express";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../controllers/cartController.js";
import { authMiddleware, allowRoles } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware, allowRoles("student"));
router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeCartItem);

export default router;

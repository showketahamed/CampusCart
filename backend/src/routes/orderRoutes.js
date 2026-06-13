import { Router } from "express";
import { checkout, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";
import { authMiddleware, allowRoles } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);
router.post("/checkout", allowRoles("student"), checkout);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", allowRoles("vendor", "admin"), updateOrderStatus);

export default router;

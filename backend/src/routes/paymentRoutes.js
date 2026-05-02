import { Router } from "express";
import { getPayments } from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.get("/", authMiddleware, getPayments);

export default router;

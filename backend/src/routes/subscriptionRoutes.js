import { Router } from "express";
import { getSubscriptions, createSubscription, deleteSubscription } from "../controllers/subscriptionController.js";
import { authMiddleware, allowRoles } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);
router.get("/", getSubscriptions);
router.post("/", allowRoles("student"), createSubscription);
router.delete("/:id", allowRoles("student"), deleteSubscription);

export default router;

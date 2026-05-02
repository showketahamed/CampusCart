import { Router } from "express";
import { updateProfile } from "../controllers/settingsController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.put("/profile", authMiddleware, updateProfile);

export default router;

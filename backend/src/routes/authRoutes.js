import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, me);
router.post("/logout", (_req, res) => res.json({ message: "Logged out on client" }));

export default router;

import { Router } from "express";
import { listUsers, updateUserStatus, listVendors, updateVendorStatus } from "../controllers/userController.js";
import { adminStats, vendorStats } from "../controllers/dashboardController.js";
import { authMiddleware, allowRoles } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);
router.get("/admin/stats", allowRoles("admin"), adminStats);
router.get("/vendor/stats", allowRoles("vendor"), vendorStats);
router.get("/users", allowRoles("admin"), listUsers);
router.patch("/users/:id/status", allowRoles("admin"), updateUserStatus);
router.get("/vendors", allowRoles("admin"), listVendors);
router.patch("/vendors/:id/status", allowRoles("admin"), updateVendorStatus);

export default router;

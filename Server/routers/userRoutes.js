import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/activate-admin", userController.activateAdmin);

// Protected routes (cần authentication + admin)
router.use(authenticateToken); // ✅ Apply middleware

router.get("/", isAdmin, userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", isAdmin, userController.deleteUser);

export default router;

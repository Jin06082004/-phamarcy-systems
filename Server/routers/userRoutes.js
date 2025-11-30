import { Router } from "express";
import {
    registerUser,
    activateAdmin,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

// Register (create) user
router.post("/register", registerUser);

// Activate admin (requires key)
router.post("/activate-admin", activateAdmin);

// Login
router.post("/login", loginUser);

// CRUD
// Protect sensitive user routes: list & delete require admin
router.get("/", authenticate, authorizeRoles('admin'), getAllUsers);
router.get("/:id", authenticate, getUserById);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, authorizeRoles('admin'), deleteUser);

export default router;

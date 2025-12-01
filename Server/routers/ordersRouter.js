import { Router } from "express";
import * as ordersController from "../controllers/ordersController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/top/:period", ordersController.getTopSellers);

// Protected routes (cần authentication)
router.use(authenticateToken); // ✅ Apply middleware cho tất cả routes phía dưới

router.get("/", ordersController.getAllOrders);
router.get("/my-orders", ordersController.getMyOrders);
router.get("/:order_id", ordersController.getOrderByOrderId);
router.post("/", ordersController.createOrder);
router.put("/:order_id", ordersController.updateOrder);
router.put("/:order_id/status", ordersController.updateOrderStatus);
router.delete("/:order_id", ordersController.deleteOrder);

export default router;

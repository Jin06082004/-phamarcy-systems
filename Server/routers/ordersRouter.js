import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderByOrderId,
  updateOrderStatus,
  deleteOrder,
  getTopSellers,
  updateOrder,
} from "../controllers/ordersController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createOrder);
router.get("/", authenticate, authorizeRoles('admin'), getAllOrders);
router.get("/my-orders", authenticate, getMyOrders);
router.get("/:order_id", getOrderByOrderId);
router.put("/:order_id", authenticate, updateOrder);
router.put("/:order_id/status", authenticate, updateOrderStatus);
router.delete("/:order_id", authenticate, authorizeRoles('admin'), deleteOrder);
router.get("/top/:period", getTopSellers);

export default router;

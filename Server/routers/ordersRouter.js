import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderByOrderId,
  updateOrderStatus,
  deleteOrder,
  getTopSellers,
  updateOrder,
} from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:order_id", getOrderByOrderId);
router.put("/:order_id", updateOrder);
router.put("/:order_id/status", updateOrderStatus);
router.delete("/:order_id", deleteOrder);
router.get("/top/:period", getTopSellers);

export default router;

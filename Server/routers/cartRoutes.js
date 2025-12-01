import { Router } from "express";
import {
  addToCart,
  getCartByUserOrGuest,
  updateItem,
  removeItem,
  clearCart,
  mergeGuestCart,
} from "../controllers/cartController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Thêm item / tạo cart
router.post("/add", addToCart);

// Lấy cart theo user_id hoặc guest token
router.get("/:key", getCartByUserOrGuest);

// Cập nhật item trong cart (by cartId)
router.put("/:id/item", updateItem);

// Xóa item trong cart
router.delete("/:id/item", removeItem);

// Xóa toàn bộ cart
router.delete("/clear/:id", clearCart);

// Merge guest -> user
// Merge guest -> user (requires authentication)
router.post("/merge", authenticateToken, mergeGuestCart);

export default router;
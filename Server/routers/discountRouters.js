/** @format */

import express from "express";
import {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  validateDiscountCode,
} from "../controllers/discountController.js";

const router = express.Router();

router.post("/", createDiscount);              // Tạo mã giảm giá
router.get("/", getAllDiscounts);              // Lấy tất cả
router.get("/validate/:code", validateDiscountCode); // Validate mã giảm giá
router.get("/:id", getDiscountById);           // Lấy theo ID
router.put("/:id", updateDiscount);            // Cập nhật
router.delete("/:id", deleteDiscount);         // Xóa

export default router;

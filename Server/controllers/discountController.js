/** @format */

import Discount from "../models/discountModel.js";

// Tạo mã giảm giá mới
export const createDiscount = async (req, res) => {
  try {
    const { code, description, percentage, start_date, end_date, usage_limit } =
      req.body;

    const existing = await Discount.findOne({ code });
    if (existing)
      return res.status(400).json({ message: "Mã giảm giá đã tồn tại" });

    const discount = new Discount({
      code,
      description,
      percentage,
      start_date,
      end_date,
      usage_limit,
    });

    await discount.save();
    res.status(201).json({ message: "Tạo mã giảm giá thành công", discount });
  } catch (error) {
    console.error("❌ Lỗi tạo discount:", error);
    res.status(500).json({ message: "Lỗi khi tạo discount", error: error.message });
  }
};

// Lấy toàn bộ mã giảm giá
export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách discount", error: error.message });
  }
};

// Lấy thông tin 1 mã giảm giá
export const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) return res.status(404).json({ message: "Không tìm thấy discount" });
    res.status(200).json(discount);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy discount", error: error.message });
  }
};

// Cập nhật mã giảm giá
export const updateDiscount = async (req, res) => {
  try {
    const updated = await Discount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy discount" });
    res.status(200).json({ message: "Cập nhật thành công", discount: updated });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật discount", error: error.message });
  }
};

// Xóa mã giảm giá
export const deleteDiscount = async (req, res) => {
  try {
    const deleted = await Discount.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy discount" });
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa discount", error: error.message });
  }
};

// Validate mã giảm giá theo code
export const validateDiscountCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Tìm discount theo code (case-insensitive)
    const discount = await Discount.findOne({ code: code.toUpperCase() });
    
    if (!discount) {
      return res.status(404).json({ 
        success: false, 
        message: "Mã giảm giá không tồn tại" 
      });
    }

    // Kiểm tra trạng thái active
    if (!discount.is_active) {
      return res.status(400).json({ 
        success: false, 
        message: "Mã giảm giá đã bị vô hiệu hóa" 
      });
    }

    // Kiểm tra ngày bắt đầu
    const now = new Date();
    const startDate = new Date(discount.start_date);
    const endDate = new Date(discount.end_date);
    
    if (now < startDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Mã giảm giá chưa có hiệu lực" 
      });
    }

    // Kiểm tra ngày kết thúc
    if (now > endDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Mã giảm giá đã hết hạn" 
      });
    }

    // Kiểm tra số lượt sử dụng
    if (discount.usage_limit && discount.used_count >= discount.usage_limit) {
      return res.status(400).json({ 
        success: false, 
        message: "Mã giảm giá đã hết lượt sử dụng" 
      });
    }

    // Mã giảm giá hợp lệ
    return res.status(200).json({ 
      success: true, 
      message: "Mã giảm giá hợp lệ",
      data: {
        _id: discount._id,
        code: discount.code,
        description: discount.description,
        percentage: discount.percentage,
        start_date: discount.start_date,
        end_date: discount.end_date,
        usage_limit: discount.usage_limit,
        used_count: discount.used_count,
        is_active: discount.is_active
      }
    });

  } catch (error) {
    console.error("❌ Lỗi validate discount:", error);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi khi kiểm tra mã giảm giá", 
      error: error.message 
    });
  }
};

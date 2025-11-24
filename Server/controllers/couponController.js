import Discount from "../models/discountModel.js";
import CouponRedemption from "../models/couponRedemptionModel.js";

/**
 * POST /coupons/redeem
 * body: { code, user_id?, guest_token?, order_id?, invoice_id?, amount? }
 * -> validate code, usage_limit, date range, is_active, then increment used_count and create redemption log
 */
export const redeemCoupon = async (req, res) => {
  try {
    const { code, user_id, guest_token, order_id, invoice_id, amount = 0 } = req.body;
    if (!code) return res.status(400).json({ success: false, message: "Mã giảm giá cần được cung cấp" });

    const discount = await Discount.findOne({ code: code.trim().toUpperCase() });
    if (!discount) return res.status(404).json({ success: false, message: "Mã giảm giá không tồn tại" });

    const now = new Date();
    if (!discount.is_active) return res.status(400).json({ success: false, message: "Mã đã bị tạm dừng" });
    if (now < new Date(discount.start_date)) return res.status(400).json({ success: false, message: "Mã chưa đến thời gian áp dụng" });
    if (now > new Date(discount.end_date)) return res.status(400).json({ success: false, message: "Mã đã hết hạn" });

    if (discount.usage_limit > 0 && discount.used_count >= discount.usage_limit) {
      return res.status(400).json({ success: false, message: "Mã đã đạt giới hạn sử dụng" });
    }

    // tăng used_count và lưu
    discount.used_count = (discount.used_count || 0) + 1;
    await discount.save();

    // tạo bản ghi redemption
    const redemption = await CouponRedemption.create({
      discount_id: discount._id,
      code: discount.code,
      user_id: user_id || null,
      guest_token: guest_token || "",
      order_id: order_id || null,
      invoice_id: invoice_id || null,
      amount: amount || 0,
    });

    res.status(200).json({ success: true, message: "Redeem thành công", data: { discount, redemption } });
  } catch (error) {
    console.error("Redeem coupon error:", error);
    res.status(500).json({ success: false, message: "Lỗi khi redeem coupon", error: error.message });
  }
};
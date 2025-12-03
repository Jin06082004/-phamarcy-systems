import Discount from "../models/discountModel.js";
import CouponRedemption from "../models/couponRedemptionModel.js";

/**
 * GET /coupons/active-promotions
 * Lấy danh sách mã khuyến mãi đang hoạt động (ngắn hạn hoặc gần hết hạn)
 */
export const getActivePromotions = async (req, res) => {
  try {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Tìm các mã:
    // 1. Đang active
    // 2. Đã bắt đầu (start_date <= now)
    // 3. Chưa hết hạn (end_date >= now)
    // 4. Còn chỗ sử dụng (usage_limit = 0 hoặc used_count < usage_limit)
    // 5. Ưu tiên: sắp hết hạn trong 3 ngày hoặc ngắn hạn (kéo dài < 7 ngày)
    
    const discounts = await Discount.find({
      is_active: true,
      start_date: { $lte: now },
      end_date: { $gte: now },
      $or: [
        { usage_limit: 0 },
        { $expr: { $lt: ['$used_count', '$usage_limit'] } }
      ]
    }).sort({ percentage: -1 }); // Sắp xếp theo % giảm giá cao nhất

    // Lọc và phân loại
    const promotions = discounts.map(d => {
      const endDate = new Date(d.end_date);
      const startDate = new Date(d.start_date);
      const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      return {
        code: d.code,
        description: d.description,
        percentage: d.percentage,
        end_date: d.end_date,
        usage_limit: d.usage_limit,
        used_count: d.used_count,
        daysLeft,
        duration,
        isExpiringSoon: daysLeft <= 3,
        isShortTerm: duration <= 7
      };
    })
    .filter(p => p.isExpiringSoon || p.isShortTerm)
    .slice(0, 5); // Chỉ lấy 5 mã hot nhất

    res.status(200).json({ success: true, data: promotions });
  } catch (error) {
    console.error("Get active promotions error:", error);
    res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách khuyến mãi", error: error.message });
  }
};

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
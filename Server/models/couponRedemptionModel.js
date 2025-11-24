import mongoose from "mongoose";

const couponRedemptionSchema = new mongoose.Schema(
  {
    discount_id: { type: mongoose.Schema.Types.ObjectId, ref: "Discount", required: true },
    code: { type: String, required: true, trim: true },
    user_id: { type: Number, default: null }, // if user logged in
    guest_token: { type: String, default: "" }, // if guest
    order_id: { type: Number, default: null },
    invoice_id: { type: Number, default: null },
    amount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CouponRedemption = mongoose.model("CouponRedemption", couponRedemptionSchema);
export default CouponRedemption;
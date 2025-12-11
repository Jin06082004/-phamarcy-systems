/*
Order Model

order{
  id: number;
  order_id: number;
  customer_id: number;
  order_items: [
    {
      drug_id: number;
        quantity: number;
        price: number;
    }
  ];
  order_date: Date;
  status: string;
  total_amount: number;
  total_paid: number;
  discount: number;
  payment_method: string;
    notes: string;
  createdAt: Date;
  updatedAt: Date;
  }
*/
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  drug_name: { type: String, required: true },
  // Store drug reference by numeric `drug_id` to match Drug model's auto-increment id
  drug_id: {
    type: Number,
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  // 💊 Đơn vị (viên, vỉ, hộp)
  unit: {
    type: String,
    enum: ['pill', 'blister', 'box'],
    default: 'pill'
  }
});

const orderSchema = new mongoose.Schema(
  {
    order_id: { type: Number, required: true, unique: true },
    customer_id: {
      type: Number,
      required: true,
    },
    order_items: [orderItemSchema],
    order_date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Cancelled"],
      default: "Pending",
    },
    total_amount: { type: Number, required: true },
    total_paid: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    payment_method: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "cash",
    },
    notes: { type: String },
    // 🎁 Thông tin mã giảm giá
    discount_info: {
      code: { type: String, default: "" },
      percentage: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }
    },
    // 📍 Địa chỉ giao hàng
    shipping_address: {
      recipient_name: { type: String },
      phone: { type: String },
      address: { type: String },
      ward: { type: String },
      district: { type: String },
      city: { type: String }
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);


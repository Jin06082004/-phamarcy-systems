import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    drug_id: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    // ✨ THÊM: Đơn vị và giá theo đơn vị
    unit: { type: String, enum: ['pill', 'blister', 'box'], default: 'pill' },
    unit_price: { type: Number, default: 0 } // Giá gốc của đơn vị này
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    // Liên kết tới user (nếu khách đã đăng nhập). Dùng user_id (Number) giống `userModel`
    user_id: { type: Number, default: null, index: true },
    // Hoặc session token cho guest
    guest_token: { type: String, default: "" , index: true},
    items: { type: [cartItemSchema], default: [] },
    subtotal: { type: Number, default: 0, min: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Tính subtotal trước khi save
cartSchema.pre("save", function (next) {
  this.subtotal = (this.items || []).reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
  this.updatedAt = new Date();
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
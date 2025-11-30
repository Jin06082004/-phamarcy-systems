import mongoose from "mongoose";

/* Hóa đơn Model

    invoice_id: Số tự động tăng
    invoice_number: Mã hóa đơn (INV-YYYYMMDD-0001)
    customer_id: Mã khách hàng (tham chiếu customer_id trong collection Customer), số nguyên
    guest: Thông tin khách vãng lai { name, phone, address }
    date: Ngày lập hóa đơn, kiểu Date
    items: Mảng sản phẩm bán (medicine_id, name, unit_price, quantity, discount, total_price)
    subtotal, discount, tax, shipping_fee, total, paid_amount
    payment_method, status
    createdAt: Ngày tạo
    updatedAt: Ngày cập nhật
*/

const lineItemSchema = new mongoose.Schema(
    {
        medicine_id: { type: Number, required: true },
        name: { type: String, required: true, trim: true },
        unit_price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        discount: { type: Number, default: 0, min: 0 },
        total_price: { type: Number, required: true, min: 0 },
        batch_number: { type: String, default: "" },
        expiration_date: { type: Date },
    },
    { _id: false }
);

const invoiceSchema = new mongoose.Schema(
    {
        invoice_id: { type: Number, unique: true },
        invoice_number: { type: String, unique: true, index: true },
        customer_id: { type: Number },
        guest: {
            name: { type: String, trim: true },
            phone: { type: String, trim: true },
            address: { type: String, trim: true },
        },
        date: { type: Date, default: Date.now },
        items: { type: [lineItemSchema], default: [] },
        subtotal: { type: Number, default: 0, min: 0 },
        discount: { type: Number, default: 0, min: 0 },
        tax: { type: Number, default: 0, min: 0 },
        shipping_fee: { type: Number, default: 0, min: 0 },
        total: { type: Number, default: 0, min: 0 },
        paid_amount: { type: Number, default: 0, min: 0 },
        payment_method: { type: String, default: "cash" },
        status: {
            type: String,
            enum: ["draft", "pending", "unpaid", "partially_paid", "paid", "cancelled", "refunded"],
            default: "pending",
        },
        createdBy: { type: String, default: "" },
        notes: { type: String, default: "" },
    },
    { timestamps: true }
);

// Auto-increment invoice_id and generate invoice_number before save
invoiceSchema.pre("save", async function (next) {
    if (!this.invoice_id) {
        const last = await this.constructor.findOne({}, { invoice_id: 1 }).sort({ invoice_id: -1 });
        this.invoice_id = last ? last.invoice_id + 1 : 1;
    }

    if (!this.invoice_number) {
        const d = this.date ? new Date(this.date) : new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const idPad = String(this.invoice_id).padStart(4, "0");
        this.invoice_number = `INV-${yyyy}${mm}${dd}-${idPad}`;
    }

    next();
});

const invoiceModel = mongoose.model("Invoice", invoiceSchema);

export default invoiceModel;
import mongoose from "mongoose";

/* Thuốc model
    drug_id - ID số tự động tăng (1, 2, 3...)
    drug_code - mã thuốc (DRG001, DRG002...)
    name - tên thuốc
    category_id - ID danh mục (dạng số: 1, 2, 3...)
    description - mô tả thuốc
    image - URL hình ảnh thuốc (nếu cần)
    price - giá thuốc
    stock - số lượng trong kho
    createdAt - ngày tạo
    updatedAt - ngày cập nhật
 */
const drugSchema = new mongoose.Schema(
    {
        drug_id: {
            type: Number,
            unique: true,
        },
        drug_code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        category_id: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        image: {
            type: String,
            default: "",
            trim: true,
        },
        
        // ✨ Pricing theo đơn vị (viên, vỉ, hộp)
        pricing: {
            pill: {
                price: { type: Number, default: 0 },      // Giá 1 viên
                stock: { type: Number, default: 0 }       // Tồn kho (viên)
            },
            blister: {
                price: { type: Number, default: 0 },      // Giá 1 vỉ
                quantity_per_unit: { type: Number, default: 10 }, // 1 vỉ = X viên
                stock: { type: Number, default: 0 }       // Tồn kho (vỉ)
            },
            box: {
                price: { type: Number, default: 0 },      // Giá 1 hộp
                quantity_per_unit: { type: Number, default: 100 }, // 1 hộp = X viên
                stock: { type: Number, default: 0 }       // Tồn kho (hộp)
            }
        },
        
        // Đơn vị mặc định hiển thị
        default_unit: {
            type: String,
            enum: ['pill', 'blister', 'box'],
            default: 'pill'
        },
        
        // DEPRECATED: Giữ để tương thích ngược
        price: {
            type: Number,
            default: 0,
            min: 0,
        },
        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
        unit: {
            type: String,
            default: "viên",
        },
        dosage: {
            type: String,
            default: "",
        },
        is_active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Auto-increment drug_id trước khi save
drugSchema.pre("save", async function (next) {
    if (!this.drug_id) {
        const lastDrug = await this.constructor
            .findOne({}, { drug_id: 1 })
            .sort({ drug_id: -1 });
        this.drug_id = lastDrug ? lastDrug.drug_id + 1 : 1;
    }
    next();
});

const drugModel = mongoose.model("Drug", drugSchema);

export default drugModel;

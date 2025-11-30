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
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        // ...
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

import mongoose from "mongoose";
import bcrypt from "bcrypt";

/* Người dùng(dược sĩ) Model
    user_id: Số tự động tăng
    username: Tên đăng nhập, chuỗi ký tự, không dấu, không khoảng trắng, không phân biệt hoa thường
    password: Mật khẩu (đã mã hóa), chuỗi ký tự
    full_name: Họ và tên, chuỗi ký tự
    phone: Số điện thoại, chuỗi ký tự
    email: Email, chuỗi ký tự
    address: Địa chỉ, chuỗi ký tự
    role: Vai trò (admin, pharmacist), chuỗi ký tự
    is_active: Kích hoạt tài khoản
    createdAt: Ngày tạo
    updatedAt: Ngày cập nhật
*/

const userSchema = new mongoose.Schema(
    {
        user_id: { type: Number, unique: true },
        username: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        full_name: { type: String, default: "" },
        phone: { type: String, default: "" },
        email: { type: String, default: "" },
        address: { type: String, default: "" },
        role: { type: String, enum: ["admin", "pharmacist", "user"], default: "user" },
        is_active: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Auto-increment user_id and hash password
userSchema.pre("save", async function (next) {
    if (!this.user_id) {
        const last = await this.constructor.findOne({}, { user_id: 1 }).sort({ user_id: -1 });
        this.user_id = last ? last.user_id + 1 : 1;
    }

    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

userSchema.methods.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;

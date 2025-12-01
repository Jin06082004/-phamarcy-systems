import userModel from "../models/userModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import emailService from "../services/emailService.js";

dotenv.config();

const ADMIN_ACTIVATION_KEY = process.env.ADMIN_ACTIVATION_KEY || "";
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

// Đăng ký người dùng (mặc định role=user, is_active=true)
export const register = async (req, res) => {
    try {
        const { username, password, full_name, phone, email, address } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Tên đăng nhập và mật khẩu là bắt buộc" });
        }

        const existing = await userModel.findOne({ username: username.toLowerCase() });
        if (existing) return res.status(400).json({ success: false, message: "Tên đăng nhập đã tồn tại" });
        
        const user = await userModel.create({ 
            username, 
            password, 
            full_name, 
            phone, 
            email, 
            address, 
            role: "user", 
            is_active: true 
        });
        
        // Gửi email chào mừng
        if (email) {
            emailService.sendRegistrationEmail(user).then(result => {
                if (result.success) {
                    console.log('✅ Email đăng ký đã được gửi đến:', email);
                } else {
                    console.warn('⚠️ Không thể gửi email đăng ký:', result.message || result.error);
                }
            });
        }
        
        res.status(201).json({ 
            success: true, 
            message: "Tạo tài khoản thành công.", 
            data: { user_id: user.user_id, username: user.username } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Tạo tài khoản thất bại", error: error.message });
    }
};

// Kích hoạt admin bằng key
export const activateAdmin = async (req, res) => {
    try {
        const { username, key } = req.body;
        
        console.log('🔑 Activate admin request:', { username, key: key?.substring(0, 5) + '...' });
        console.log('🔐 Expected key:', ADMIN_ACTIVATION_KEY?.substring(0, 5) + '...');
        
        if (!username || !key) {
            return res.status(400).json({ success: false, message: "Cần username và key để kích hoạt" });
        }

        if (key !== ADMIN_ACTIVATION_KEY) {
            console.warn('⚠️ Invalid activation key provided');
            return res.status(403).json({ success: false, message: "Key kích hoạt không hợp lệ" });
        }

        const user = await userModel.findOne({ username: username.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });

        user.role = "admin";
        user.is_active = true;
        await user.save();

        // Gửi email thông báo nâng cấp admin
        if (user.email) {
            emailService.sendAdminUpgradeEmail(user).then(result => {
                if (result.success) {
                    console.log('✅ Email nâng cấp admin đã được gửi đến:', user.email);
                } else {
                    console.warn('⚠️ Không thể gửi email nâng cấp admin:', result.message || result.error);
                }
            });
        }

        console.log('✅ Admin activated successfully:', user.username);
        res.status(200).json({ success: true, message: "Kích hoạt admin thành công", data: { user_id: user.user_id, username: user.username } });
    } catch (error) {
        console.error('❌ Activate admin error:', error);
        res.status(500).json({ success: false, message: "Kích hoạt admin thất bại", error: error.message });
    }
};

// Đăng nhập
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng nhập đầy đủ thông tin" 
            });
        }

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "Tên đăng nhập không tồn tại" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Mật khẩu không đúng" 
            });
        }

        if (!user.is_active) {
            return res.status(403).json({ 
                success: false, 
                message: "Tài khoản chưa được kích hoạt" 
            });
        }

        const payload = {
            user_id: user.user_id,
            username: user.username,
            role: user.role,
            full_name: user.full_name,
            email: user.email
        };

        // ✅ Sử dụng JWT_SECRET từ .env
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

        console.log('✅ Login successful:', user.username);
        console.log('   JWT_SECRET:', JWT_SECRET);
        console.log('   Token:', token.substring(0, 20) + '...');
        
        res.status(200).json({ 
            success: true, 
            message: "Đăng nhập thành công", 
            data: payload, 
            token 
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Đăng nhập thất bại", 
            error: error.message 
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select("-password").sort({ user_id: -1 });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lấy danh sách người dùng thất bại", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findOne({ user_id: Number(id) }).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lấy thông tin người dùng thất bại", error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Nếu có password trong body thì model sẽ tự hash trong pre-save
        const user = await userModel.findOne({ user_id: Number(id) });
        if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });

        Object.assign(user, req.body);
        await user.save();

        res.status(200).json({ success: true, message: "Cập nhật người dùng thành công", data: { user_id: user.user_id, username: user.username } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Cập nhật người dùng thất bại", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await userModel.findOneAndDelete({ user_id: Number(id) });
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        res.status(200).json({ success: true, message: "Xóa người dùng thành công", data: { user_id: deleted.user_id, username: deleted.username } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Xóa người dùng thất bại", error: error.message });
    }
};

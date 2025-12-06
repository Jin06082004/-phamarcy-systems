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

        // Kiểm tra nếu role được nâng cấp lên pharmacist
        const oldRole = user.role;
        const newRole = req.body.role;
        const isUpgradedToPharmacist = oldRole !== 'pharmacist' && newRole === 'pharmacist';

        Object.assign(user, req.body);
        await user.save();

        // Gửi email thông báo nếu được nâng cấp lên pharmacist
        if (isUpgradedToPharmacist && user.email) {
            emailService.sendPharmacistUpgradeEmail(user).then(result => {
                if (result.success) {
                    console.log('✅ Email thông báo nâng cấp pharmacist đã được gửi đến:', user.email);
                } else {
                    console.warn('⚠️ Không thể gửi email nâng cấp:', result.message || result.error);
                }
            });
        }

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

// 📍 Lấy danh sách địa chỉ đã lưu
export const getSavedAddresses = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const user = await userModel.findOne({ user_id: userId });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        }

        res.status(200).json({ 
            success: true, 
            data: user.saved_addresses || [] 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi lấy địa chỉ", error: error.message });
    }
};

// 📍 Thêm địa chỉ mới
export const addAddress = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { recipient_name, phone, address, ward, district, city, is_default } = req.body;

        if (!recipient_name || !phone || !address || !city) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu thông tin bắt buộc (recipient_name, phone, address, city)" 
            });
        }

        const user = await userModel.findOne({ user_id: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        }

        // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
        if (is_default) {
            user.saved_addresses.forEach(addr => {
                addr.is_default = false;
            });
        }

        // Nếu đây là địa chỉ đầu tiên, tự động đặt làm mặc định
        const isFirstAddress = !user.saved_addresses || user.saved_addresses.length === 0;

        user.saved_addresses.push({
            recipient_name,
            phone,
            address,
            ward: ward || '',
            district: district || '',
            city,
            is_default: is_default || isFirstAddress
        });

        await user.save();

        res.status(201).json({ 
            success: true, 
            message: "Thêm địa chỉ thành công",
            data: user.saved_addresses[user.saved_addresses.length - 1]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi thêm địa chỉ", error: error.message });
    }
};

// 📍 Cập nhật địa chỉ
export const updateAddress = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { addressId } = req.params;
        const { recipient_name, phone, address, ward, district, city, is_default } = req.body;

        const user = await userModel.findOne({ user_id: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        }

        const addressIndex = user.saved_addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return res.status(404).json({ success: false, message: "Không tìm thấy địa chỉ" });
        }

        // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
        if (is_default) {
            user.saved_addresses.forEach(addr => {
                addr.is_default = false;
            });
        }

        // Cập nhật địa chỉ
        if (recipient_name) user.saved_addresses[addressIndex].recipient_name = recipient_name;
        if (phone) user.saved_addresses[addressIndex].phone = phone;
        if (address) user.saved_addresses[addressIndex].address = address;
        if (ward !== undefined) user.saved_addresses[addressIndex].ward = ward;
        if (district !== undefined) user.saved_addresses[addressIndex].district = district;
        if (city) user.saved_addresses[addressIndex].city = city;
        if (is_default !== undefined) user.saved_addresses[addressIndex].is_default = is_default;

        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "Cập nhật địa chỉ thành công",
            data: user.saved_addresses[addressIndex]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi cập nhật địa chỉ", error: error.message });
    }
};

// 📍 Xóa địa chỉ
export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { addressId } = req.params;

        const user = await userModel.findOne({ user_id: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        }

        const addressIndex = user.saved_addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return res.status(404).json({ success: false, message: "Không tìm thấy địa chỉ" });
        }

        const wasDefault = user.saved_addresses[addressIndex].is_default;
        user.saved_addresses.splice(addressIndex, 1);

        // Nếu xóa địa chỉ mặc định và còn địa chỉ khác, đặt địa chỉ đầu tiên làm mặc định
        if (wasDefault && user.saved_addresses.length > 0) {
            user.saved_addresses[0].is_default = true;
        }

        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "Xóa địa chỉ thành công"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi xóa địa chỉ", error: error.message });
    }
};

// 📍 Đặt địa chỉ mặc định
export const setDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { addressId } = req.params;

        const user = await userModel.findOne({ user_id: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        }

        const addressIndex = user.saved_addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return res.status(404).json({ success: false, message: "Không tìm thấy địa chỉ" });
        }

        // Bỏ mặc định của tất cả địa chỉ
        user.saved_addresses.forEach(addr => {
            addr.is_default = false;
        });

        // Đặt địa chỉ được chọn làm mặc định
        user.saved_addresses[addressIndex].is_default = true;

        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "Đã đặt địa chỉ mặc định",
            data: user.saved_addresses[addressIndex]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi đặt địa chỉ mặc định", error: error.message });
    }
};


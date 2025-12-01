# 📧 Hướng dẫn cấu hình Email Service

## Tổng quan
Hệ thống tự động gửi email thông báo cho các sự kiện:
- ✅ **Đăng ký tài khoản thành công**
- 👑 **Nâng cấp lên Admin**
- 🛒 **Đặt đơn hàng thành công** (status: Pending)
- 📦 **Đơn hàng đang xử lý** (status: Processing)
- 🎉 **Đơn hàng đã hoàn thành** (status: Completed)

## Cách cấu hình Gmail

### Bước 1: Tạo App Password cho Gmail

1. Truy cập: https://myaccount.google.com/security
2. Bật **2-Step Verification** (xác thực 2 bước)
3. Sau khi bật, vào phần **App passwords**
4. Chọn **Mail** và **Windows Computer** (hoặc Other)
5. Click **Generate** → Gmail sẽ tạo ra mật khẩu 16 ký tự
6. Copy mật khẩu này (không có dấu cách)

### Bước 2: Cập nhật file `.env`

Mở file `Server/.env` và điền thông tin:

```env
EMAIL_USER=your-email@gmail.com          # Email Gmail của bạn
EMAIL_PASSWORD=abcd efgh ijkl mnop       # App Password vừa tạo (16 ký tự)
WEB_URL=http://localhost:5500            # URL frontend (hoặc domain thật)
```

**Ví dụ thực tế:**
```env
EMAIL_USER=pharmacy.online@gmail.com
EMAIL_PASSWORD=xyzw abcd efgh ijkl
WEB_URL=https://pharmacy-online.com
```

### Bước 3: Khởi động lại server

```bash
cd Server
npm start
```

## Kiểm tra email đã hoạt động

### Test đăng ký tài khoản
```bash
POST http://localhost:5000/users/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456",
  "full_name": "Nguyen Van Test",
  "email": "test@example.com",    # ← Email nhận thông báo
  "phone": "0123456789"
}
```

✅ Kiểm tra email → Sẽ nhận email "Chào mừng đến với Nhà Thuốc Online!"

### Test nâng cấp Admin
```bash
POST http://localhost:5000/users/activate-admin
Content-Type: application/json

{
  "username": "testuser",
  "key": "MyS3cr3tAdm1nK3y"
}
```

👑 Kiểm tra email → Sẽ nhận email "Chúc mừng nâng cấp Admin!"

### Test đặt hàng
```bash
POST http://localhost:5000/orders/create
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "customer_id": 1,
  "order_items": [
    {
      "drug_id": 1,
      "drug_name": "Paracetamol",
      "quantity": 2,
      "price": 50000
    }
  ],
  "payment_method": "cash",
  "notes": "Giao giờ hành chính"
}
```

🛒 Kiểm tra email → Sẽ nhận email "Đặt hàng thành công!"

### Test cập nhật trạng thái đơn hàng
```bash
PUT http://localhost:5000/orders/update-status/1
Content-Type: application/json

{
  "status": "Processing"    # hoặc "Completed"
}
```

📦 Status "Processing" → Email "Đơn hàng đang được xử lý"
🎉 Status "Completed" → Email "Đơn hàng đã được giao thành công"

## Templates Email

### 1. Email Đăng ký
- **Subject:** 🎉 Chào mừng bạn đến với Nhà Thuốc Online!
- **Nội dung:** Thông tin tài khoản, nút "Đăng nhập ngay"
- **Màu chủ đạo:** Gradient tím (#667eea → #764ba2)

### 2. Email Nâng cấp Admin
- **Subject:** 👑 Chúc mừng! Bạn đã được nâng cấp lên Admin
- **Nội dung:** Danh sách quyền hạn mới, nút "Truy cập trang Admin"
- **Màu chủ đạo:** Gradient hồng (#f093fb → #f5576c)

### 3. Email Đặt hàng thành công
- **Subject:** ✅ Đơn hàng #123 đã được đặt thành công
- **Nội dung:** Chi tiết đơn hàng, bảng sản phẩm, tổng tiền
- **Màu chủ đạo:** Gradient xanh lá (#10b981 → #059669)

### 4. Email Đang xử lý
- **Subject:** 📦 Đơn hàng #123 đang được xử lý
- **Nội dung:** Thông báo đơn hàng đang được chuẩn bị
- **Màu chủ đạo:** Gradient xanh dương (#3b82f6 → #2563eb)

### 5. Email Hoàn thành
- **Subject:** 🎉 Đơn hàng #123 đã được giao thành công
- **Nội dung:** Xác nhận giao hàng, nút "Tiếp tục mua sắm"
- **Màu chủ đạo:** Gradient xanh lá (#10b981 → #059669)

## Lưu ý quan trọng

### 🔒 Bảo mật
- **KHÔNG** commit file `.env` lên Git
- File `.env` đã được thêm vào `.gitignore`
- Sử dụng App Password, không dùng mật khẩu Gmail thật

### ⚡ Performance
- Email được gửi **bất đồng bộ** (không block response)
- Nếu email thất bại, API vẫn trả về success
- Log ghi lại trạng thái gửi email

### 📝 Log
```
✅ Email sent successfully: <message-id>
✅ Email đăng ký đã được gửi đến: user@example.com
⚠️ Không thể gửi email đăng ký: Không có email người nhận
❌ Error sending email: Invalid login
```

### 🌐 Thay đổi URL Frontend
Nếu deploy lên server thật, cập nhật `WEB_URL` trong `.env`:
```env
WEB_URL=https://your-domain.com
```

## Troubleshooting

### Email không được gửi
1. ✅ Kiểm tra `EMAIL_USER` và `EMAIL_PASSWORD` trong `.env`
2. ✅ Đảm bảo đã bật 2-Step Verification trên Gmail
3. ✅ App Password phải là 16 ký tự (không có dấu cách khi paste)
4. ✅ Kiểm tra log trong terminal khi gửi email
5. ✅ Kiểm tra user có email trong database không

### Email vào Spam
- Gmail có thể đánh dấu email từ App Password là spam lần đầu
- Vào Spam folder và đánh dấu "Not spam"
- Email sau sẽ vào Inbox

### Lỗi "Invalid login"
- App Password không đúng
- Chưa bật 2-Step Verification
- Tạo lại App Password mới

## Mở rộng

### Thêm template email mới
File: `Server/services/emailService.js`

```javascript
const newTemplate = (data) => `
<!DOCTYPE html>
<html>
  <!-- Your HTML template here -->
</html>
`;

export const emailService = {
  sendNewEmail: async (data) => {
    const subject = 'Your Subject';
    const html = newTemplate(data);
    return await sendEmail(data.email, subject, html);
  }
};
```

### Sử dụng dịch vụ email khác
Thay đổi trong `emailService.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

---

**Tác giả:** DACN Team  
**Ngày cập nhật:** 02/12/2025

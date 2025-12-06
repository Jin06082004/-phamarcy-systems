# 🔐 Cập nhật Hệ thống Pharmacist Login & Notification

## ✅ Các thay đổi đã thực hiện

### 1. **Cập nhật Login Redirect Logic**
📍 File: `Web/user/pages/login.html`

**Trước đây:**
```javascript
const redirectPath = response.data.role === "admin" 
  ? "/Web/admin/index.html" 
  : "/Web/user/index.html";
```

**Bây giờ:**
```javascript
let redirectPath;
switch(response.data.role) {
  case 'admin':
    redirectPath = '/Web/admin/index.html';
    break;
  case 'pharmacist':
    redirectPath = '/Web/pharmacist/index.html';
    break;
  default:
    redirectPath = '/Web/user/index.html';
}
```

**Kết quả:**
- ✅ Admin → `/Web/admin/index.html`
- ✅ Pharmacist → `/Web/pharmacist/index.html`
- ✅ User → `/Web/user/index.html`

---

### 2. **Email Thông báo Nâng cấp Pharmacist**
📍 File: `Server/services/emailService.js`

**Template Email mới:**
```javascript
const pharmacistUpgradeTemplate = (user) => `
  <div class="header">
    <h1>💊 Chúc mừng nâng cấp Dược sĩ!</h1>
  </div>
  <div class="content">
    <p>Tài khoản của bạn đã được nâng cấp lên quyền DƯỢC SĨ</p>
    
    <strong>Quyền hạn mới:</strong>
    - 💳 Thanh toán tại quầy (POS)
    - 📦 Quản lý đơn hàng
    - 💊 Quản lý thuốc và tồn kho
    - 🖨️ In hóa đơn
    - 📊 Xem thống kê
    
    <button>Truy cập trang Dược sĩ</button>
  </div>
`;
```

**Function export:**
```javascript
sendPharmacistUpgradeEmail: async (user) => {
  if (!user.email) return { success: false, message: 'Không có email' };
  
  const subject = '💊 Chúc mừng! Bạn đã được nâng cấp lên Dược sĩ';
  const html = pharmacistUpgradeTemplate(user);
  return await sendEmail(user.email, subject, html);
}
```

---

### 3. **Tự động gửi Email khi Admin nâng cấp User**
📍 File: `Server/controllers/userController.js`

**Logic mới trong `updateUser`:**
```javascript
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
            console.log('✅ Email thông báo nâng cấp đã được gửi đến:', user.email);
        } else {
            console.warn('⚠️ Không thể gửi email:', result.message);
        }
    });
}
```

---

## 🎯 Quy trình hoạt động

### **Kịch bản 1: Admin nâng cấp User lên Pharmacist**

1. **Admin vào trang quản lý User:**
   - Chọn user cần nâng cấp
   - Đổi role từ `user` → `pharmacist`
   - Click "Cập nhật"

2. **Server xử lý:**
   ```javascript
   // userController.js
   const oldRole = user.role;        // "user"
   const newRole = req.body.role;    // "pharmacist"
   const isUpgradedToPharmacist = true;
   
   // Lưu database
   user.role = "pharmacist";
   await user.save();
   
   // Gửi email
   emailService.sendPharmacistUpgradeEmail(user);
   ```

3. **User nhận email:**
   ```
   Subject: 💊 Chúc mừng! Bạn đã được nâng cấp lên Dược sĩ
   
   Xin chào [Tên],
   
   Chúc mừng! Tài khoản của bạn đã được nâng cấp lên DƯỢC SĨ
   
   Quyền hạn mới:
   - Thanh toán tại quầy
   - Quản lý đơn hàng
   - In hóa đơn
   ...
   
   [Truy cập trang Dược sĩ]
   ```

4. **User đăng nhập lại:**
   ```javascript
   // Login response
   { 
     role: "pharmacist",
     ...
   }
   
   // Redirect tự động
   window.location.href = '/Web/pharmacist/index.html';
   ```

---

### **Kịch bản 2: Pharmacist đăng nhập lần đầu**

```
1. Nhập username/password
2. Click "Đăng nhập"
3. Server trả về: { role: "pharmacist" }
4. Frontend kiểm tra role
5. Redirect → /Web/pharmacist/index.html
6. Hiển thị dashboard dược sĩ
```

---

## 📧 Email Template Preview

### **Email Nâng cấp Pharmacist**

```html
┌─────────────────────────────────────┐
│  💊 Chúc mừng nâng cấp Dược sĩ!    │
│        (Header màu xanh lá)        │
└─────────────────────────────────────┘

🏥

Xin chào [Tên],

Chúc mừng! Tài khoản của bạn đã được 
nâng cấp lên quyền [DƯỢC SĨ]

Quyền hạn mới của bạn:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 Thanh toán tại quầy (POS)
📦 Quản lý đơn hàng
💊 Quản lý thuốc và tồn kho
🖨️ In hóa đơn cho khách hàng
📊 Xem thống kê doanh thu
👥 Tư vấn và hỗ trợ khách hàng

Lưu ý quan trọng:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 Bảo mật thông tin khách hàng
✅ Kiểm tra kỹ đơn thuốc
📝 Ghi chép đầy đủ
⚕️ Tuân thủ quy định

┌─────────────────────────────────────┐
│   [Truy cập trang Dược sĩ] →       │
└─────────────────────────────────────┘

💡 Mẹo: Khi đăng nhập lần tiếp theo,
hệ thống sẽ tự động chuyển bạn đến
trang dành cho dược sĩ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© 2024 Nhà Thuốc Online
Nếu cần hỗ trợ, vui lòng liên hệ admin
```

---

## 🧪 Test Cases

### **Test 1: Admin nâng cấp User → Pharmacist**

**Steps:**
```bash
1. Login as Admin
2. Vào trang Users
3. Chọn user (role: "user")
4. Đổi role → "pharmacist"
5. Click "Cập nhật"
```

**Expected:**
- ✅ Database: role = "pharmacist"
- ✅ Console: "✅ Email thông báo nâng cấp đã được gửi"
- ✅ User nhận email với subject "💊 Chúc mừng! Bạn đã được nâng cấp lên Dược sĩ"
- ✅ Email có nút "Truy cập trang Dược sĩ"

---

### **Test 2: Pharmacist Login**

**Steps:**
```bash
1. Logout (nếu đang login)
2. Vào trang login
3. Nhập credentials của pharmacist
4. Click "Đăng nhập"
```

**Expected:**
- ✅ Redirect → `/Web/pharmacist/index.html`
- ✅ Hiển thị dashboard dược sĩ
- ✅ Sidebar có menu: Dashboard, POS, Quản lý thuốc, Đơn hàng

---

### **Test 3: User bình thường Login**

**Steps:**
```bash
1. Login với user role = "user"
```

**Expected:**
- ✅ Redirect → `/Web/user/index.html`
- ✅ Không truy cập được `/Web/pharmacist/`
- ✅ Không có menu Pharmacist

---

### **Test 4: Admin Login**

**Steps:**
```bash
1. Login với admin
```

**Expected:**
- ✅ Redirect → `/Web/admin/index.html`
- ✅ Có thể truy cập cả `/Web/pharmacist/` (vì auth.js cho phép admin)

---

## 🔍 Debugging

### **Console Logs để kiểm tra:**

```javascript
// Login
console.log('✅ Login response:', response);
console.log('➡️ Redirecting to:', redirectPath, '(role:', role + ')');

// Update User
console.log('📝 Old role:', oldRole);
console.log('📝 New role:', newRole);
console.log('📧 Send pharmacist email:', isUpgradedToPharmacist);

// Email Service
console.log('✅ Email thông báo đã gửi đến:', user.email);
console.log('⚠️ Không thể gửi email:', error.message);
```

---

## 📋 Checklist

- [x] Cập nhật login redirect logic
- [x] Tạo pharmacist email template
- [x] Thêm sendPharmacistUpgradeEmail function
- [x] Update userController để tự động gửi email
- [x] Test pharmacist login redirect
- [x] Test email notification

---

## 🚀 Deployment Notes

### **Environment Variables cần có:**

```env
# Email config
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
USE_ETHEREAL=false

# Web URL
WEB_URL=http://localhost:5500

# Or production
WEB_URL=https://your-domain.com
```

### **Gmail App Password:**

1. Vào Google Account Settings
2. Security → 2-Step Verification
3. App passwords → Generate
4. Copy password → Paste vào `.env`

---

## 🎉 Tổng kết

### **Cải tiến chính:**

1. ✅ **Auto redirect** dựa trên role
2. ✅ **Email notification** khi nâng cấp
3. ✅ **Không phải config thủ công** - Tự động hoàn toàn
4. ✅ **UX tốt hơn** - User biết ngay khi được nâng cấp

### **Cách hoạt động:**

```
Admin nâng cấp User
        ↓
Server detect role change
        ↓
Gửi email tự động
        ↓
User nhận thông báo
        ↓
User login lại
        ↓
Redirect đúng trang Pharmacist
        ↓
Sử dụng các tính năng mới
```

---

🎯 **All done!** Hệ thống giờ đã hoàn chỉnh với:
- Login redirect cho pharmacist
- Email notification tự động
- Phân quyền rõ ràng
- UX mượt mà

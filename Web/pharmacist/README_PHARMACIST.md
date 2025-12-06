# 🏥 Hệ thống Pharmacist - Tách riêng JavaScript

## 📁 Cấu trúc File

```
Web/pharmacist/
├── css/
│   └── pharmacist.css          # CSS riêng cho pharmacist
├── js/
│   ├── auth.js                 # Xác thực và phân quyền pharmacist
│   ├── dashboard.js            # Logic trang dashboard
│   ├── pos.js                  # Logic trang thanh toán (POS)
│   └── invoice-print.js        # Logic in hóa đơn
├── index.html                  # Dashboard dược sĩ
├── pos.html                    # Trang thanh toán tại quầy
└── invoice-print.html          # Trang in hóa đơn
```

---

## 🔐 Phân Quyền & Bảo Mật

### `auth.js` - Module xác thực riêng

**Chức năng:**
- ✅ Kiểm tra quyền truy cập (chỉ `pharmacist` và `admin`)
- ✅ Redirect tự động nếu không có quyền
- ✅ Hiển thị thông tin dược sĩ
- ✅ Xử lý đăng xuất an toàn

**API Export:**
```javascript
import { 
  initPharmacistAuth,    // Khởi tạo auth khi trang load
  getCurrentUser,        // Lấy thông tin user hiện tại
  handleLogout          // Xử lý đăng xuất
} from './auth.js';
```

**Cách sử dụng:**
```javascript
// Trong mỗi file JS của pharmacist
import { initPharmacistAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // Kiểm tra quyền ngay khi trang load
  if (!initPharmacistAuth()) {
    return; // Dừng nếu không có quyền
  }
  
  // Code logic tiếp theo...
});
```

---

## 📊 Dashboard (`dashboard.js`)

**Chức năng:**
- Load thống kê hóa đơn hôm nay
- Tính doanh thu hôm nay
- Cảnh báo thuốc sắp hết (< 10)
- Sidebar toggle

**Không xung đột với:**
- ❌ Admin dashboard
- ❌ User dashboard

---

## 🛒 Point of Sale (`pos.js`)

**Chức năng:**
- Quản lý giỏ hàng độc lập
- Tìm kiếm sản phẩm real-time
- Kiểm tra tồn kho
- Tính toán thuế VAT
- Chọn phương thức thanh toán
- Tạo hóa đơn

**State Management:**
```javascript
let allDrugs = [];           // Danh sách thuốc
let cart = [];              // Giỏ hàng (scope riêng)
let selectedPayment = 'cash'; // Phương thức thanh toán
```

**Không xung đột với:**
- ❌ User cart (khác scope)
- ❌ Admin features

---

## 🖨️ Invoice Print (`invoice-print.js`)

**Chức năng:**
- Load và hiển thị hóa đơn
- Format dữ liệu in ấn
- Không cần authentication (view only)

---

## 🔄 So Sánh: Trước & Sau

### ❌ TRƯỚC (Inline Scripts - Dễ xung đột)

```html
<!-- pos.html -->
<script type="module">
  let cart = [];  // ⚠️ Global scope
  // 300+ dòng code inline
</script>

<!-- index.html -->
<script type="module">
  let cart = [];  // ⚠️ Trùng tên biến!
  // Code khác...
</script>
```

**Vấn đề:**
- Biến global trùng tên
- Khó maintain
- Không tái sử dụng code
- Phân quyền phải viết lại mỗi file

---

### ✅ SAU (Module riêng biệt - Không xung đột)

```html
<!-- pos.html -->
<script type="module" src="js/pos.js"></script>

<!-- index.html -->
<script type="module" src="js/dashboard.js"></script>
```

**Ưu điểm:**
- ✅ Mỗi module có scope riêng
- ✅ Auth tập trung tại `auth.js`
- ✅ Dễ maintain và debug
- ✅ Tái sử dụng code
- ✅ Không xung đột với admin/user

---

## 🚀 Hướng Dẫn Sử Dụng

### 1. **Truy cập Dashboard Pharmacist**
```
http://127.0.0.1:5500/Web/pharmacist/index.html
```

### 2. **Thanh Toán Tại Quầy**
- Click "Bắt đầu thanh toán"
- Hoặc: `http://127.0.0.1:5500/Web/pharmacist/pos.html`

### 3. **Quy Trình Bán Hàng**
1. Tìm kiếm thuốc
2. Click để thêm vào giỏ
3. Điều chỉnh số lượng
4. Nhập thông tin khách (optional)
5. Chọn phương thức thanh toán
6. Click "Thanh toán"
7. Tự động chuyển sang trang in hóa đơn

---

## 🛡️ Bảo Mật & Phân Quyền

### Kiểm Tra Tự Động
```javascript
// auth.js tự động kiểm tra
export function checkPharmacistAuth() {
  const user = getCurrentUser();
  
  if (!user.user_id || !user.role) {
    redirectToLogin();
    return false;
  }
  
  const allowedRoles = ['pharmacist', 'admin'];
  if (!allowedRoles.includes(user.role)) {
    alert('⚠️ Bạn không có quyền truy cập!');
    redirectToDashboard(user.role);
    return false;
  }
  
  return true;
}
```

### Redirect Logic
- `user` → User dashboard
- `admin` → Admin dashboard  
- `pharmacist` → Pharmacist dashboard
- Chưa login → Login page

---

## 🔧 Bảo Trì & Mở Rộng

### Thêm Tính Năng Mới

**1. Tạo file JS mới:**
```javascript
// js/new-feature.js
import { initPharmacistAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!initPharmacistAuth()) return;
  
  // Logic mới...
});
```

**2. Link trong HTML:**
```html
<script type="module" src="js/new-feature.js"></script>
```

### Debug

**Console sẽ hiển thị:**
```
✅ Auth check passed: pharmacist
✅ Dashboard stats loaded
❌ Error: API failed
```

---

## 📦 Dependencies

### Internal
- `../shared/notification.js` - Thông báo toast
- `../shared/api.js` - API wrapper (cần có `invoiceAPI`)

### External
- Boxicons CSS
- Admin CSS (dùng chung layout)

---

## ✨ Tính Năng Hoàn Chỉnh

### 🎯 Point of Sale (POS)
- [x] Tìm kiếm thuốc real-time
- [x] Thêm/xóa/cập nhật giỏ hàng
- [x] Kiểm tra tồn kho
- [x] Tính thuế VAT 10%
- [x] 3 phương thức thanh toán (Tiền mặt/Thẻ/Credit)
- [x] Nhập thông tin khách hàng
- [x] Validation đầy đủ

### 🖨️ In Hóa Đơn
- [x] Hiển thị đầy đủ thông tin
- [x] Format tiền tệ VNĐ
- [x] In trực tiếp (Ctrl+P)
- [x] Responsive design
- [x] Lưu vào database

### 📊 Dashboard
- [x] Thống kê hóa đơn hôm nay
- [x] Doanh thu hôm nay
- [x] Cảnh báo thuốc sắp hết
- [x] Quick access to POS

---

## 🐛 Troubleshooting

### Lỗi: "Cannot read property of undefined"
```javascript
// Kiểm tra xem element có tồn tại không
const element = document.getElementById('some-id');
if (element) {
  element.textContent = 'value';
}
```

### Lỗi: "Module not found"
- Kiểm tra đường dẫn relative: `./auth.js` hoặc `../shared/api.js`
- Đảm bảo file tồn tại

### Lỗi: "User không có quyền"
- Kiểm tra `localStorage.getItem('user')`
- Đảm bảo role = 'pharmacist' hoặc 'admin'

---

## 📝 Notes

### Về CORS
Nếu gặp lỗi CORS khi gọi API:
```javascript
// Server cần config:
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));
```

### Về Token
Nếu API yêu cầu JWT token:
```javascript
// auth.js đã handle trong getAuthHeaders()
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}
```

---

## 🎉 Kết Luận

Hệ thống pharmacist giờ đây:
- ✅ **Module hóa hoàn toàn**
- ✅ **Không xung đột với admin/user**
- ✅ **Bảo mật với phân quyền riêng**
- ✅ **Dễ maintain và mở rộng**
- ✅ **Code sạch và có tổ chức**

Mỗi file JavaScript có scope và mục đích riêng biệt, tránh hoàn toàn việc xung đột biến global hay logic.

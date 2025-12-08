# 🏥 DrugStore - Hệ thống Quản lý Nhà thuốc

Hệ thống quản lý nhà thuốc toàn diện với giao diện web hiện đại, hỗ trợ quản lý thuốc, đơn hàng, người dùng, khuyến mãi và thống kê.

---

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu hình biến môi trường](#-cấu-hình-biến-môi-trường)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [API Endpoints](#-api-endpoints)
- [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [Troubleshooting](#-troubleshooting)
- [Testing](#-testing)
- [Đóng góp](#-đóng-góp)
- [Changelog](#-changelog)
- [License](#-license)
- [Team](#-team)
- [Tài liệu tham khảo](#-tài-liệu-tham-khảo)

---

## 🎯 Tổng quan

**DrugStore** là hệ thống quản lý nhà thuốc được xây dựng với kiến trúc **Client-Server**, sử dụng **MongoDB** làm cơ sở dữ liệu và **RESTful API** để giao tiếp giữa frontend và backend.

**Đặc điểm nổi bật:**
- ✅ Phân quyền 3 cấp: Admin, Pharmacist (Dược sĩ), User
- ✅ Quản lý đầy đủ: Thuốc, Danh mục, Đơn hàng, Người dùng, Khuyến mãi
- ✅ Gửi email tự động (đăng ký, nâng cấp quyền, trạng thái đơn hàng)
- ✅ Thanh toán VietQR tích hợp
- ✅ Quản lý địa chỉ 63 tỉnh/thành Việt Nam
- ✅ Hệ thống POS (Point of Sale) cho dược sĩ
- ✅ Chatbox AI tư vấn khách hàng
- ✅ Thống kê trực quan với Chart.js

---

## ✨ Tính năng

### 🔐 Xác thực & Phân quyền
- ✅ Đăng ký, đăng nhập người dùng
- ✅ Phân quyền: Admin, Dược sĩ (Pharmacist), Người dùng (User)
- ✅ Kích hoạt tài khoản Admin bằng key bảo mật
- ✅ Gửi email xác nhận đăng ký và nâng cấp quyền

### 👤 Người dùng (User)
- 🛒 Xem danh sách thuốc theo 10 danh mục
- 🔍 Tìm kiếm, lọc sản phẩm
- 🛍️ Thêm vào giỏ hàng, thanh toán
- 📦 Xem lịch sử đơn hàng
- 🎁 Áp dụng mã khuyến mãi
- 👤 Quản lý thông tin cá nhân
- 📍 Quản lý địa chỉ giao hàng (63 tỉnh/thành phố VN)
- 💳 Thanh toán VietQR hoặc COD
- 🤖 Chatbox tư vấn AI

### 🔧 Quản trị viên (Admin)
- 📊 Dashboard với thống kê trực quan (Chart.js)
- 💊 Quản lý thuốc (CRUD)
- 📂 Quản lý danh mục (10 categories)
- 📋 Quản lý đơn hàng
- 👥 Quản lý người dùng
- 🎟️ Quản lý mã giảm giá/khuyến mãi
- 📈 Thống kê doanh thu, thuốc bán chạy
- 📧 Nhận thông báo email khi có đơn hàng mới

### 💊 Dược sĩ (Pharmacist)
- 🛒 Hệ thống POS (Point of Sale) bán hàng tại quầy
- 💳 Thanh toán tiền mặt/thẻ/credit
- 🖨️ In hóa đơn cho khách hàng
- 📦 Quản lý đơn hàng
- 📊 Kiểm tra tồn kho
- 💊 Xem thông tin thuốc (read-only)
- 📈 Thống kê doanh thu cá nhân

### 🚀 Tính năng nâng cao
- 📧 Email Service (Nodemailer + Gmail SMTP)
- 💳 VietQR Payment Integration
- 🗺️ Địa chỉ Việt Nam (63 tỉnh/thành + quận/huyện)
- 🎨 UI/UX hiện đại (Gradient, Animations)
- 📱 Responsive Design
- 🤖 AI Chatbox tư vấn thuốc
- 🔍 Tìm kiếm thông minh
- 📊 Biểu đồ thống kê real-time

---

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** (v18+)
- **Express.js** (v4.18+)
- **MongoDB** + **Mongoose** (v7+)
- **bcrypt** (mã hóa mật khẩu)
- **jsonwebtoken** (JWT authentication)
- **dotenv** (quản lý biến môi trường)
- **cors** (Cross-Origin Resource Sharing)
- **nodemailer** (gửi email)
- **multer** (upload file)

### Frontend
- **HTML5** + **CSS3** (Grid, Flexbox, Animations)
- **JavaScript ES6+** (Modules, Async/Await, Fetch API)
- **Chart.js** (biểu đồ thống kê)
- **Boxicons** (icon library)

### Database
- **MongoDB Atlas** (cloud database)

---

## 💻 Yêu cầu hệ thống

| Phần mềm | Phiên bản tối thiểu |
|----------|---------------------|
| Node.js  | 18.x trở lên        |
| npm/yarn | 8.x trở lên         |
| MongoDB  | 6.x (hoặc Atlas)    |
| Browser  | Chrome 90+, Firefox 88+, Edge 90+ |

---

## 📥 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/yourusername/DACN.git
cd DACN
```

### 2. Cài đặt dependencies cho Server

```bash
cd Server
npm install
```

**Dependencies chính sẽ được cài:**
- `express`
- `mongoose`
- `bcrypt`
- `jsonwebtoken`
- `dotenv`
- `cors`
- `nodemailer`
- `multer`

### 3. Cài đặt Frontend (optional)

Frontend không cần build tool, chỉ cần serve static files. Khuyến nghị dùng **Live Server** (VSCode extension) hoặc:

```bash
npm install -g serve
```

---

## 🔧 Cấu hình biến môi trường

### Tạo file `.env` trong thư mục `Server/`

```bash
cd Server
touch .env  # Linux/Mac
# hoặc
echo. > .env  # Windows
```

### Nội dung file `.env` (Dữ liệu mẫu)

```env
# ========== DATABASE ==========
# Thông tin MongoDB Atlas (Dùng tài khoản riêng của bạn)
DB_USERNAME=demo_user
DB_PASSWORD=Demo@2024Password
# ⚠️ QUAN TRỌNG: Thay thế bằng username/password thật từ MongoDB Atlas của bạn
# Hướng dẫn tạo MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register

# ========== SERVER ==========
PORT=5000
# Port mà server sẽ chạy (mặc định: 5000)

# ========== JWT ==========
JWT_SECRET=demo_jwt_secret_key_change_in_production_abc123xyz456
JWT_EXPIRES=7d
# ⚠️ Thời gian hết hạn token (7 ngày)
# ⚠️ QUAN TRỌNG: Đổi JWT_SECRET trong production thành chuỗi ngẫu nhiên 32+ ký tự

# ========== ADMIN ACTIVATION ==========
ADMIN_ACTIVATION_KEY=MyS3cr3tAdm1nK3y
# ⚠️ Key bảo mật để kích hoạt tài khoản Admin
# ⚠️ QUAN TRỌNG: Thay đổi key này trong production!

# ========== EMAIL SERVICE ==========
# Cấu hình Gmail SMTP (Dùng tài khoản riêng)
EMAIL_USER=demo.pharmacy@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
# ⚠️ QUAN TRỌNG: 
# - Thay bằng email Gmail thật của bạn
# - EMAIL_PASSWORD là App Password (KHÔNG phải mật khẩu Gmail)
# - Hướng dẫn tạo App Password: Server/EMAIL_SETUP.md

# URL Frontend (cho link trong email)
WEB_URL=http://localhost:5500
# ⚠️ Trong production: https://yourdomain.com

# Chế độ test email (true = dùng Ethereal fake SMTP, false = dùng Gmail)
USE_ETHEREAL=false
# ⚠️ Đặt true để test email mà không gửi thật

# ========== ENVIRONMENT ==========
NODE_ENV=development
# development hoặc production
```

### Chi tiết từng biến:

| Biến | Mô tả | Ví dụ Mẫu | Lưu ý |
|------|-------|-----------|-------|
| `DB_USERNAME` | Tên đăng nhập MongoDB Atlas | `demo_user` | Thay bằng username MongoDB của bạn |
| `DB_PASSWORD` | Mật khẩu MongoDB Atlas | `Demo@2024Password` | Thay bằng password MongoDB của bạn |
| `PORT` | Cổng server chạy | `5000` | Mặc định 5000 |
| `JWT_SECRET` | Khóa bí mật mã hóa JWT token | `demo_jwt_secret_key...` | **BẮT BUỘC** đổi trong production |
| `JWT_EXPIRES` | Thời gian token hết hạn | `7d` | 7 ngày |
| `ADMIN_ACTIVATION_KEY` | Key kích hoạt Admin | `MyS3cr3tAdm1nK3y` | **BẮT BUỘC** đổi trong production |
| `EMAIL_USER` | Email Gmail | `demo.pharmacy@gmail.com` | Thay bằng Gmail của bạn |
| `EMAIL_PASSWORD` | App Password Gmail | `abcd efgh ijkl mnop` | Xem [`EMAIL_SETUP.md`](Server/EMAIL_SETUP.md) |
| `WEB_URL` | URL Frontend | `http://localhost:5500` | Dùng domain thật khi deploy |
| `USE_ETHEREAL` | Test mode email | `false` | `true` = không gửi email thật |
| `NODE_ENV` | Môi trường | `development` | `production` khi deploy |

### 🔐 Lưu ý bảo mật:

- ⚠️ **TUYỆT ĐỐI KHÔNG commit file `.env`** lên Git/GitHub
- ✅ File `.gitignore` đã tự động bỏ qua `.env`
- 🔒 Trong production:
  - Đổi `JWT_SECRET` thành chuỗi ngẫu nhiên mạnh (32+ ký tự)
  - Đổi `ADMIN_ACTIVATION_KEY` thành key phức tạp
  - Dùng `EMAIL_USER` và `EMAIL_PASSWORD` riêng (không dùng mẫu)
- 📧 `EMAIL_PASSWORD` là **App Password** (16 ký tự), không phải mật khẩu Gmail thường
- 🔗 Hướng dẫn cấu hình email chi tiết: xem file [`Server/EMAIL_SETUP.md`](Server/EMAIL_SETUP.md)

### 📚 Tài liệu tham khảo thêm:

- [Hướng dẫn tạo MongoDB Atlas Database](https://www.mongodb.com/docs/atlas/getting-started/)
- [Hướng dẫn tạo Gmail App Password](Server/EMAIL_SETUP.md)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

---

## 🚀 Chạy ứng dụng

### 1. Khởi động Server (Backend)

```bash
cd Server
npm start
# Hoặc dùng nodemon để auto-reload:
npm run dev
```

Server sẽ chạy tại: **http://localhost:5000**

**Output mong đợi:**
```
📧 Using Gmail: demo.pharmacy@gmail.com
MongoDB connected successfully!
🚀 Server is running on http://localhost:5000
```

**Nếu thấy lỗi MongoDB:**
```
❌ Error connecting to MongoDB: MongooseServerSelectionError
```
→ Kiểm tra lại `DB_USERNAME` và `DB_PASSWORD` trong `.env`

---

### 2. Khởi động Frontend

**Khuyến nghị:** Dùng **Live Server** (VSCode Extension)

1. Cài đặt extension **Live Server** trong VSCode
2. Mở thư mục `Web/` trong VSCode
3. Click chuột phải vào file `index.html` → **"Open with Live Server"**
4. Frontend sẽ chạy tại: **http://127.0.0.1:5500**

**Hoặc dùng Node.js serve:**

```bash
cd Web
npx serve -s . -p 5500
# Hoặc
python -m http.server 5500  # Python 3
```

**⚠️ LƯU Ý:**
- **PHẢI** chạy qua HTTP server (Live Server hoặc serve)
- **KHÔNG** mở trực tiếp file HTML (double-click) vì sẽ bị lỗi CORS khi load components

---

### 3. Truy cập ứng dụng

| Vai trò | URL | Ghi chú |
|---------|-----|---------|
| **User** | http://127.0.0.1:5500/Web/user/index.html | Trang chủ |
| **Admin** | http://127.0.0.1:5500/Web/admin/index.html | Cần đăng nhập với role admin |
| **Pharmacist** | http://127.0.0.1:5500/Web/pharmacist/index.html | Cần đăng nhập với role pharmacist |
| **API Server** | http://localhost:5000/api | Backend API |

---

## 📁 Cấu trúc thư mục

```
DACN/
├── Server/                    # Backend (Node.js + Express)
│   ├── controllers/           # Logic xử lý request
│   │   ├── cartController.js
│   │   ├── categoriesControler.js
│   │   ├── couponController.js
│   │   ├── discountController.js
│   │   ├── drugControler.js
│   │   ├── inventoryController.js
│   │   ├── invoiceController.js
│   │   ├── ordersController.js
│   │   ├── prescriptionController.js
│   │   ├── uploadController.js
│   │   └── userController.js
│   ├── models/                # Schema MongoDB
│   │   ├── cartModel.js
│   │   ├── categoryModel.js
│   │   ├── discountModel.js
│   │   ├── drugModel.js
│   │   ├── inventoryModel.js
│   │   ├── invoiceModel.js
│   │   ├── orderModel.js
│   │   ├── prescriptionModel.js
│   │   └── userModel.js
│   ├── routers/               # API routes
│   │   ├── cartRouter.js
│   │   ├── categoriesRouter.js
│   │   ├── couponRouter.js
│   │   ├── discountRouter.js
│   │   ├── drugRouter.js
│   │   ├── inventoryRouter.js
│   │   ├── invoiceRouter.js
│   │   ├── orderRouter.js
│   │   ├── prescriptionRouter.js
│   │   ├── uploadRouter.js
│   │   └── userRouter.js
│   ├── middleware/            # Middleware (auth, validation)
│   │   └── authMiddleware.js
│   ├── services/              # Business logic
│   │   └── emailService.js    # ✨ Gửi email
│   ├── data/                  # Seed data
│   │   ├── categories-seed.json
│   │   └── drugs-seed.json
│   ├── .env                   # ⚠️ Biến môi trường (KHÔNG commit)
│   ├── .gitignore
│   ├── EMAIL_SETUP.md         # 📧 Hướng dẫn cấu hình email
│   ├── package.json
│   └── server.js              # Entry point
│
├── Web/                       # Frontend (HTML/CSS/JS)
│   ├── admin/                 # Trang quản trị
│   │   ├── index.html         # Dashboard
│   │   ├── drugs.html         # Quản lý thuốc
│   │   ├── categories.html    # Quản lý danh mục
│   │   ├── orders.html        # Quản lý đơn hàng
│   │   ├── users.html         # Quản lý người dùng
│   │   ├── discount.html      # Quản lý khuyến mãi
│   │   ├── statistics.html    # Thống kê
│   │   ├── activate.html      # Kích hoạt Admin
│   │   └── css/
│   │       └── admin.css
│   │
│   ├── pharmacist/            # Trang dược sĩ ✨
│   │   ├── index.html         # Dashboard dược sĩ
│   │   ├── pos.html           # Point of Sale (bán hàng)
│   │   ├── orders.html        # Quản lý đơn hàng
│   │   ├── drugs.html         # Xem danh sách thuốc
│   │   ├── inventory.html     # Kiểm tra tồn kho
│   │   ├── invoice-print.html # In hóa đơn
│   │   ├── css/
│   │   │   └── pharmacist.css
│   │   └── js/                # ✨ JavaScript modules
│   │       ├── auth.js        # Authentication
│   │       ├── dashboard.js   # Dashboard logic
│   │       ├── pos.js         # POS system
│   │       ├── orders.js      # Order management
│   │       ├── drugs.js       # Drug viewing
│   │       ├── inventory.js   # Stock checking
│   │       └── invoice-print.js # Invoice printing
│   │
│   ├── user/                  # Trang người dùng
│   │   ├── index.html         # Trang chủ
│   │   ├── pages/
│   │   │   ├── login.html
│   │   │   ├── profile.html   # ✨ Quản lý thông tin cá nhân
│   │   │   ├── drugs.html
│   │   │   ├── pain-relief.html    # Giảm đau - Hạ sốt
│   │   │   ├── antibiotics.html    # Kháng sinh
│   │   │   ├── vitamins.html       # Vitamin & Khoáng chất
│   │   │   ├── digestive.html      # Tiêu hóa
│   │   │   ├── cold-flu.html       # Cảm cúm - Dị ứng
│   │   │   ├── products.html       # Thực phẩm chức năng
│   │   │   ├── personal-care.html  # Chăm sóc cá nhân
│   │   │   ├── mom-baby.html       # Mẹ & Bé
│   │   │   ├── cardiovascular.html # Tim mạch - Huyết áp
│   │   │   ├── stomach.html        # Dạ dày - Đường ruột
│   │   │   ├── promotions.html # ✨ Trang khuyến mãi
│   │   │   ├── my-orders.html
│   │   │   ├── cart.html
│   │   │   ├── checkout.html  # ✨ Có VietQR & địa chỉ VN
│   │   │   └── order-success.html
│   │   └── css/
│   │       ├── dashboard.css
│   │       ├── login.css
│   │       └── checkout.css
│   │
│   └── shared/                # Tài nguyên dùng chung
│       ├── api.js             # API client wrappers
│       ├── cartApi.js         # Cart API
│       ├── couponApi.js       # Coupon API
│       ├── categoryConfig.js  # ✨ Config 10 categories
│       ├── adminButton.js     # ✨ Nút admin ẩn
│       ├── userBackButton.js  # ✨ Nút quay lại user
│       ├── include.js         # Component loader
│       ├── notification.js    # Toast notification
│       ├── chatbox.js         # ✨ AI Chatbox
│       ├── components/
│       │   ├── topbar.html
│       │   ├── navbar.html    # ✨ Tự động load 10 categories
│       │   └── footer.html
│       └── images/
│           └── (logo, banners, etc.)
│
├── CATEGORY_PAGES.md          # 📖 Hướng dẫn thêm trang category
├── PHARMACIST_LOGIN_UPDATE.md # 📖 Hướng dẫn pharmacist
├── CHATBOX_README.md          # 📖 Hướng dẫn chatbox
└── README.md                  # File này
```

---

## 🌐 API Endpoints

**Base URL:** `http://localhost:5000/api`

### 🔐 Authentication

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/users/register` | Đăng ký user | ❌ |
| POST | `/users/login` | Đăng nhập | ❌ |
| POST | `/users/activate-admin` | Kích hoạt Admin | ❌ |
| GET | `/users/me` | Lấy thông tin user hiện tại | ✅ |

### 💊 Drugs API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/drugs` | Lấy tất cả thuốc | ❌ |
| GET | `/drugs/:id` | Lấy chi tiết thuốc | ❌ |
| POST | `/drugs` | Thêm thuốc mới | ✅ Admin |
| PUT | `/drugs/:id` | Cập nhật thuốc | ✅ Admin |
| DELETE | `/drugs/:id` | Xóa thuốc | ✅ Admin |
| GET | `/drugs/search` | Tìm kiếm thuốc | ❌ |

### 📂 Categories API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/categories` | Lấy tất cả danh mục | ❌ |
| GET | `/categories/:id` | Lấy chi tiết danh mục | ❌ |
| POST | `/categories` | Thêm danh mục | ✅ Admin |
| PUT | `/categories/:id` | Cập nhật danh mục | ✅ Admin |
| DELETE | `/categories/:id` | Xóa danh mục | ✅ Admin |

### 📋 Orders API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/orders` | Lấy tất cả đơn hàng | ✅ Admin |
| GET | `/orders/my-orders` | Lấy đơn hàng của user | ✅ |
| GET | `/orders/:id` | Lấy chi tiết đơn hàng | ✅ |
| POST | `/orders` | Tạo đơn hàng mới | ✅ |
| PUT | `/orders/update-status/:id` | Cập nhật trạng thái | ✅ Admin |
| DELETE | `/orders/:id` | Xóa đơn hàng | ✅ Admin |

### 👥 Users API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/users` | Lấy tất cả user | ✅ Admin |
| GET | `/users/:id` | Lấy chi tiết user | ✅ Admin |
| PUT | `/users/:id` | Cập nhật user | ✅ Admin |
| DELETE | `/users/:id` | Xóa user | ✅ Admin |
| PUT | `/users/:id/upgrade-role` | Nâng cấp role | ✅ Admin |

### 🛒 Cart API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/carts` | Lấy giỏ hàng | ❌ |
| POST | `/carts/add` | Thêm vào giỏ | ❌ |
| PUT | `/carts/update` | Cập nhật số lượng | ❌ |
| DELETE | `/carts/remove` | Xóa khỏi giỏ | ❌ |
| POST | `/carts/merge` | Merge guest cart khi login | ✅ |

### 🎟️ Coupon API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/coupons/redeem` | Sử dụng mã giảm giá | ❌ |

### 🎁 Discount API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/discounts` | Lấy tất cả discount | ❌ |
| GET | `/discounts/:id` | Lấy chi tiết discount | ❌ |
| POST | `/discounts` | Thêm discount | ✅ Admin |
| PUT | `/discounts/:id` | Cập nhật discount | ✅ Admin |
| DELETE | `/discounts/:id` | Xóa discount | ✅ Admin |

### 🧾 Invoice API (Pharmacist)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/invoices` | Lấy tất cả hóa đơn | ✅ Pharmacist |
| GET | `/invoices/:id` | Lấy chi tiết hóa đơn | ✅ Pharmacist |
| POST | `/invoices` | Tạo hóa đơn mới (POS) | ✅ Pharmacist |

---

## 📖 Hướng dẫn sử dụng

### 1️⃣ Đăng ký & Đăng nhập

#### Người dùng (User)
1. Truy cập: http://127.0.0.1:5500/Web/user/pages/login.html
2. Click tab **"Đăng ký"**
3. Điền thông tin:
   - Họ tên (VD: `Nguyễn Văn A`)
   - Email (VD: `nguyenvana@example.com`)
   - Tên đăng nhập (VD: `nguyenvana`)
   - Mật khẩu (tối thiểu 8 ký tự, VD: `Pass@123`)
4. Click **"Tạo tài khoản"**
5. ✅ Nhận email xác nhận đăng ký (nếu đã cấu hình email)
6. Đăng nhập với tài khoản vừa tạo

**Mặc định:** Role = `user`, is_active = `true` (tự động kích hoạt)

---

#### Quản trị viên (Admin)
1. Đăng ký tài khoản như user (VD: `adminuser`)
2. Truy cập: http://127.0.0.1:5500/Web/admin/activate.html
3. Nhập:
   - Tên đăng nhập: `adminuser`
   - Admin key: `MyS3cr3tAdm1nK3y` (hoặc key bạn đặt trong `.env`)
4. Click **"Kích hoạt Admin"**
5. ✅ Nhận email thông báo nâng cấp Admin
6. Đăng nhập lại với tài khoản Admin

**💡 Mẹo:** Key mặc định trong file mẫu là `MyS3cr3tAdm1nK3y`

---

#### Dược sĩ (Pharmacist)
1. Admin nâng cấp user thành pharmacist:
   - Vào **"Người dùng"** → Click **"Nâng cấp"**
   - Chọn role **"Pharmacist"**
2. ✅ User nhận email thông báo nâng cấp
3. Đăng nhập lại → Tự động redirect đến `/Web/pharmacist/index.html`

---

### 2️⃣ Mua hàng (User)

1. **Xem sản phẩm:**
   - Trang chủ: Xem sản phẩm nổi bật
   - Hoặc vào từng danh mục:
     - Giảm đau - Hạ sốt: `/user/pages/pain-relief.html`
     - Kháng sinh: `/user/pages/antibiotics.html`
     - Vitamin & Khoáng chất: `/user/pages/vitamins.html`
     - Tiêu hóa: `/user/pages/digestive.html`
     - Cảm cúm - Dị ứng: `/user/pages/cold-flu.html`
     - Thực phẩm chức năng: `/user/pages/products.html`
     - Chăm sóc cá nhân: `/user/pages/personal-care.html`
     - Mẹ & Bé: `/user/pages/mom-baby.html`
     - Tim mạch - Huyết áp: `/user/pages/cardiovascular.html`
     - Dạ dày - Đường ruột: `/user/pages/stomach.html`

2. **Thêm vào giỏ:**
   - Click nút **"Thêm vào giỏ"** ở mỗi sản phẩm
   - Xem giỏ hàng: Click icon 🛒 ở topbar

3. **Thanh toán:**
   - Trong trang giỏ hàng, click **"Thanh toán"**
   - Điền thông tin giao hàng (có dropdown 63 tỉnh/thành VN)
   - Chọn phương thức thanh toán:
     - 💳 **VietQR** (quét mã QR)
     - 💰 **COD** (thanh toán khi nhận hàng)
   - Click **"Đặt hàng"**

4. **Theo dõi đơn hàng:**
   - Menu → **"Đơn hàng của tôi"** (`/user/pages/my-orders.html`)
   - Xem trạng thái:
     - 🟡 Pending (Chờ xử lý)
     - 🔵 Processing (Đang xử lý)
     - 🟢 Completed (Đã hoàn thành)
     - 🔴 Cancelled (Đã hủy)

5. **Quản lý tài khoản:**
   - Menu → **"Tài khoản"** (`/user/pages/profile.html`)
   - Cập nhật thông tin cá nhân
   - Quản lý địa chỉ giao hàng (thêm/sửa/xóa)
   - Đổi mật khẩu

---

### 3️⃣ Quản lý (Admin)

#### Dashboard
- Xem tổng quan: Tổng thuốc, đơn hàng, người dùng, doanh thu
- Biểu đồ: Doanh thu 6 tháng, Top thuốc bán chạy

#### Quản lý thuốc
1. Click **"Thuốc"** trong sidebar
2. **Thêm thuốc:**
   - Click **"Thêm thuốc mới"**
   - Điền thông tin:
     - Mã thuốc (VD: `PAR001`)
     - Tên thuốc (VD: `Paracetamol 500mg`)
     - Giá (VD: `15000`)
     - Số lượng tồn kho (VD: `100`)
     - Danh mục (chọn từ dropdown)
     - Mô tả
     - URL hình ảnh
   - Click **"Lưu"**
3. **Sửa:** Click icon ✏️
4. **Xóa:** Click icon 🗑️

#### Quản lý đơn hàng
1. Click **"Đơn hàng"** trong sidebar
2. Xem danh sách đơn hàng
3. **Cập nhật trạng thái:**
   - Click nút **"Xem/Sửa"**
   - Chọn trạng thái mới:
     - 🟡 Pending → 🔵 Processing
     - 🔵 Processing → 🟢 Completed
     - Hoặc 🔴 Cancelled
   - Click **"Cập nhật trạng thái"**
   - ✅ Khách hàng nhận email thông báo thay đổi trạng thái

#### Quản lý người dùng
1. Click **"Người dùng"** trong sidebar
2. Xem danh sách user
3. **Sửa thông tin:** Click icon ✏️
4. **Xóa user:** Click icon 🗑️
5. **Nâng cấp quyền:**
   - Click **"Nâng cấp"**
   - Chọn role mới (Admin/Pharmacist)
   - ✅ User nhận email thông báo

#### Quản lý khuyến mãi
1. Click **"Khuyến mãi"** trong sidebar
2. **Thêm mã giảm giá:**
   - Click **"Thêm mã giảm giá mới"**
   - Điền thông tin:
     - Mã giảm giá (VD: `SUMMER2024`)
     - Mô tả (VD: `Giảm giá mùa hè`)
     - Phần trăm giảm: `10` (= 10%)
     - Ngày bắt đầu: `2024-06-01`
     - Ngày kết thúc: `2024-08-31`
     - Giới hạn lượt sử dụng: `100`
   - Click **"Lưu"**
3. **Sửa/Xóa:** Click icon ✏️ hoặc 🗑️

#### Thống kê
1. Click **"Thống kê"** trong sidebar
2. Xem:
   - 💰 Doanh thu năm nay
   - 📊 Biểu đồ doanh thu 12 tháng
   - 🏆 Top 10 thuốc bán chạy năm
   - 📈 Xu hướng bán hàng

---

### 4️⃣ Dược sĩ (Pharmacist)

#### Dashboard
- Xem thống kê:
  - 🧾 Hóa đơn hôm nay
  - 💰 Doanh thu hôm nay
  - ⚠️ Thuốc sắp hết (< 10 đơn vị)

#### Bán hàng (POS)
1. Click **"Bán hàng"** (`/pharmacist/pos.html`)
2. **Thêm sản phẩm:**
   - Tìm kiếm thuốc (auto-complete)
   - Nhập số lượng
   - Click **"Thêm"**
3. **Xem giỏ hàng:**
   - Kiểm tra danh sách sản phẩm
   - Tự động tính: Tạm tính, VAT 10%, Tổng cộng
4. **Thanh toán:**
   - Nhập thông tin khách hàng (tên, SĐT)
   - Chọn phương thức: Tiền mặt/Thẻ/Credit
   - Click **"Thanh toán"**
   - ✅ Tạo hóa đơn và tự động giảm tồn kho

#### In hóa đơn
- Sau khi thanh toán, redirect đến trang in
- Click **"In hóa đơn"** (Ctrl+P)

#### Kiểm tra tồn kho
1. Click **"Tồn kho"** (`/pharmacist/inventory.html`)
2. Xem thống kê:
   - 🔴 Hết hàng
   - 🟡 Sắp hết (< 10)
   - 🟢 Còn hàng
3. Tìm kiếm, lọc theo danh mục

#### Quản lý đơn hàng
1. Click **"Đơn hàng"** (`/pharmacist/orders.html`)
2. Xem danh sách đơn hàng online
3. Cập nhật trạng thái (tương tự Admin)

---

## 🔍 Troubleshooting

### Lỗi CORS

**Lỗi:**
```
Access to fetch at 'http://localhost:5000/...' from origin 'http://127.0.0.1:5500' 
has been blocked by CORS policy
```

**Giải pháp:**
- Đảm bảo frontend chạy trên port **5500**
- Nếu dùng port khác, thêm vào `allowedOrigins` trong [`Server/server.js`](Server/server.js):
  ```javascript
  const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000", // Thêm port mới
  ];
  ```
- Khởi động lại server sau khi sửa

---

### Không tải được component (topbar/navbar/footer)

**Lỗi:**
```
Không thể tải component.
```

**Giải pháp:**
1. Đảm bảo đường dẫn đúng trong attribute `data-include`:
   ```html
   <div data-include="../../shared/components/navbar.html"></div>
   ```
2. **QUAN TRỌNG:** Chạy frontend qua HTTP server (Live Server, `serve`, Python HTTP server)
   - ❌ KHÔNG mở trực tiếp file HTML (double-click)
   - ✅ Dùng Live Server hoặc `npx serve -s . -p 5500`
3. Mở Developer Tools (F12) → Console để xem lỗi chi tiết

---

### Không nhận được email

**Triệu chứng:**
- Đăng ký/nâng cấp admin thành công nhưng không có email

**Giải pháp:**
1. Kiểm tra cấu hình trong `.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop  # App Password 16 ký tự
   USE_ETHEREAL=false
   ```
2. Đảm bảo `EMAIL_PASSWORD` là **App Password** (không phải mật khẩu Gmail thường)
   - Xem hướng dẫn: [`Server/EMAIL_SETUP.md`](Server/EMAIL_SETUP.md)
3. Kiểm tra log server:
   ```
   ✅ Email sent successfully: <message-id>
   ✅ Email đăng ký đã được gửi đến: user@example.com
   ```
4. Kiểm tra thư mục **Spam** trong Gmail

---

### Lỗi MongoDB Connection

**Lỗi:**
```
❌ Error connecting to MongoDB: MongooseServerSelectionError
```

**Giải pháp:**
1. Kiểm tra `DB_USERNAME` và `DB_PASSWORD` trong `.env`
2. Đảm bảo đã tạo database user trong MongoDB Atlas
3. Whitelist IP address:
   - Vào MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (cho phép tất cả IP)
4. Kiểm tra connection string trong `server.js`:
   ```javascript
   mongoose.connect(
     `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.xxxxx.mongodb.net/drugstore?retryWrites=true&w=majority`
   );
   ```

---

### Token hết hạn

**Lỗi:**
```
401 Unauthorized: Token expired
```

**Giải pháp:**
- Đăng xuất và đăng nhập lại
- Token mặc định hết hạn sau 7 ngày (cấu hình trong `.env`: `JWT_EXPIRES=7d`)

---

### Pharmacist không thể truy cập POS

**Lỗi:**
```
Bạn không có quyền truy cập trang này
```

**Giải pháp:**
1. Đảm bảo user đã được nâng cấp lên role **pharmacist**
2. Đăng xuất và đăng nhập lại
3. Kiểm tra localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('user')).role // Phải là "pharmacist"
   ```

---

## 🧪 Testing

### Test API bằng Postman/Thunder Client

#### 1. Đăng ký user (Dữ liệu mẫu)
```http
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "username": "demo_user",
  "password": "Demo@1234",
  "full_name": "Người Dùng Demo",
  "email": "demo@example.com",
  "phone": "0901234567"
}
```

---

#### 2. Đăng nhập (Dữ liệu mẫu)
```http
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "username": "demo_user",
  "password": "Demo@1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "user": {
    "user_id": 1,
    "username": "demo_user",
    "full_name": "Người Dùng Demo",
    "email": "demo@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
📌 **Lưu token để dùng cho các request tiếp theo**

---

#### 3. Lấy danh sách thuốc
```http
GET http://localhost:5000/api/drugs
```

---

#### 4. Tìm kiếm thuốc (Dữ liệu mẫu)
```http
GET http://localhost:5000/api/drugs/search?keyword=paracetamol
```

---

#### 5. Tạo đơn hàng (Dữ liệu mẫu)
```http
POST http://localhost:5000/api/orders
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "customer_id": 1,
  "customer_name": "Người Dùng Demo",
  "customer_phone": "0901234567",
  "customer_address": "123 Đường ABC, Quận 1, TP.HCM",
  "order_items": [
    {
      "drug_id": 1,
      "drug_name": "Paracetamol 500mg",
      "quantity": 2,
      "price": 15000
    },
    {
      "drug_id": 5,
      "drug_name": "Vitamin C 1000mg",
      "quantity": 1,
      "price": 120000
    }
  ],
  "payment_method": "cash",
  "status": "Pending"
}
```

---

#### 6. Áp dụng mã giảm giá (Dữ liệu mẫu)
```http
POST http://localhost:5000/api/coupons/redeem
Content-Type: application/json

{
  "code": "SUMMER2024",
  "order_total": 150000
}
```

**Response:**
```json
{
  "success": true,
  "discount": {
    "code": "SUMMER2024",
    "percentage": 10,
    "discount_amount": 15000
  }
}
```

---

#### 7. Kích hoạt Admin (Dữ liệu mẫu)
```http
POST http://localhost:5000/api/users/activate-admin
Content-Type: application/json

{
  "username": "demo_user",
  "admin_key": "MyS3cr3tAdm1nK3y"
}
```

---

#### 8. Lấy danh sách user (Cần token Admin)
```http
GET http://localhost:5000/api/users
Authorization: Bearer <admin-token>
```

---

### Test Frontend

1. **Kiểm tra trang chủ:**
   - Truy cập: http://127.0.0.1:5500/Web/user/index.html
   - Kiểm tra: Navbar, footer, sản phẩm nổi bật

2. **Kiểm tra đăng nhập:**
   - Username: `demo_user`
   - Password: `Demo@1234`

3. **Kiểm tra giỏ hàng:**
   - Thêm sản phẩm vào giỏ
   - Cập nhật số lượng
   - Xóa sản phẩm

4. **Kiểm tra checkout:**
   - Điền thông tin giao hàng
   - Chọn tỉnh/thành → Xem quận/huyện
   - Tạo đơn hàng

5. **Kiểm tra Admin:**
   - Kích hoạt admin với key
   - Đăng nhập → Truy cập dashboard
   - Thêm/sửa/xóa thuốc
   - Quản lý đơn hàng

6. **Kiểm tra Pharmacist:**
   - Nâng cấp user lên pharmacist
   - Đăng nhập → Redirect đến POS
   - Tạo hóa đơn bán hàng
   - In hóa đơn

---

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Để đóng góp:

1. Fork repository này
2. Tạo branch mới: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push lên branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

### Quy tắc code:
- Đặt tên biến/hàm rõ ràng (camelCase)
- Comment cho logic phức tạp
- Tuân thủ cấu trúc MVC
- Test kỹ trước khi commit
- **KHÔNG** commit file `.env` hoặc credentials thật

### Checklist trước khi commit:
- [ ] Code chạy không lỗi
- [ ] Đã test trên trình duyệt
- [ ] Đã xóa console.log không cần thiết
- [ ] Đã kiểm tra `.gitignore` (không commit `.env`, `node_modules`)
- [ ] Đã viết comment cho code phức tạp
- [ ] Commit message rõ ràng

---

## 📝 Changelog

### Version 1.1.0 (2024-12-02) - Latest ✨
- ✅ Thêm Email Service (đăng ký, nâng cấp admin/pharmacist, đơn hàng)
- ✅ Tích hợp VietQR cho thanh toán
- ✅ Thêm quản lý địa chỉ với 63 tỉnh/thành VN
- ✅ Thêm 10 trang category đầy đủ
- ✅ Cải thiện UI/UX (gradient, animations)
- ✅ Thêm trang khuyến mãi cho user
- ✅ Thêm trang thống kê chi tiết cho admin
- ✅ Thêm hệ thống Pharmacist (POS, in hóa đơn, tồn kho)
- ✅ Fix bug giảm stock khi đặt hàng
- ✅ Cập nhật hướng dẫn sử dụng dữ liệu mẫu
- ✅ Thêm AI Chatbox tư vấn khách hàng

### Version 1.0.0 (2024-01-15)
- ✅ Hoàn thiện hệ thống User & Admin
- ✅ CRUD đầy đủ cho Drug, Category, Order, User, Discount
- ✅ Giỏ hàng + Checkout flow
- ✅ Thống kê & biểu đồ
- ✅ UI/UX hiện đại với gradient & animations
- ✅ Responsive design

---

## 📜 License

Dự án này được phát hành dưới giấy phép **MIT License**.

```
MIT License

Copyright (c) 2024 DrugStore Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 👥 Team

- **Developer**: Nguyễn Nguyên Phúc, Võ Hoàng Quân
- **Email**: Phucnguyenn0608@gmail.com
- **GitHub**: [DACN Repository](https://github.com/yourusername/DACN)

---

## 🙏 Cảm ơn

- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - ODM
- [Chart.js](https://www.chartjs.org/) - Biểu đồ
- [Boxicons](https://boxicons.com/) - Icon library
- [Nodemailer](https://nodemailer.com/) - Email service
- [VietQR](https://vietqr.io/) - QR Code thanh toán

---

## 📚 Tài liệu tham khảo

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [JWT Introduction](https://jwt.io/introduction)
- [RESTful API Design Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)

---

## 🔗 Liên kết hữu ích

- [MongoDB Atlas Tutorial](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)
- [Gmail App Password Setup](Server/EMAIL_SETUP.md)
- [CORS Configuration Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [bcrypt Password Hashing](https://www.npmjs.com/package/bcrypt)
- [Chart.js Examples](https://www.chartjs.org/docs/latest/samples/)

---

**🎉 Happy Coding! 🎉**

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra [Troubleshooting](#-troubleshooting)
2. Xem [`Server/EMAIL_SETUP.md`](Server/EMAIL_SETUP.md) cho vấn đề email
3. Xem [`CATEGORY_PAGES.md`](CATEGORY_PAGES.md) để thêm trang category mới
4. Xem [`PHARMACIST_LOGIN_UPDATE.md`](PHARMACIST_LOGIN_UPDATE.md) cho hệ thống Pharmacist
5. Xem [`CHATBOX_README.md`](Web/CHATBOX_README.md) cho tính năng Chatbox
6. Tạo [Issue](https://github.com/yourusername/DACN/issues) trên GitHub
7. Liên hệ qua email: Phucnguyenn0608@gmail.com

---

**Phiên bản:** 1.1.0  
**Cập nhật lần cuối:** 02/12/2024  
**Ngôn ngữ:** Tiếng Việt 🇻🇳
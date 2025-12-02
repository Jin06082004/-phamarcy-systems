# 🏥 DrugStore - Hệ thống Quản lý Nhà thuốc

Hệ thống quản lý nhà thuốc toàn diện với giao diện web hiện đại, hỗ trợ quản lý thuốc, đơn hàng, người dùng, khuyến mãi và thống kê.

---

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình biến môi trường](#cấu-hình-biến-môi-trường)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [API Endpoints](#api-endpoints)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Troubleshooting](#troubleshooting)
- [Đóng góp](#đóng-góp)
- [License](#license)

---

## 🎯 Tổng quan

**DrugStore** là một hệ thống quản lý nhà thuốc đầy đủ chức năng, được xây dựng với kiến trúc **Client-Server** hiện đại:

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: HTML5 + CSS3 + JavaScript (ES6+)
- **Kiến trúc**: RESTful API
- **Database**: MongoDB Atlas (Cloud)

---

## ✨ Tính năng

### 🔐 Xác thực & Phân quyền
- ✅ Đăng ký, đăng nhập người dùng
- ✅ Phân quyền: Admin, Dược sĩ (Pharmacist), Người dùng (User)
- ✅ Kích hoạt tài khoản Admin bằng key bảo mật
- ✅ Gửi email xác nhận đăng ký và nâng cấp quyền

### 👤 Người dùng (User)
- 🛒 Xem danh sách thuốc theo danh mục
- 🔍 Tìm kiếm, lọc sản phẩm
- 🛍️ Thêm vào giỏ hàng, thanh toán
- 📦 Xem lịch sử đơn hàng
- 🎁 Áp dụng mã khuyến mãi
- 👤 Quản lý thông tin cá nhân
- 📍 Quản lý địa chỉ giao hàng (63 tỉnh/thành phố VN)

### 🔧 Quản trị viên (Admin)
- 📊 Dashboard với thống kê trực quan (Chart.js)
- 💊 Quản lý thuốc (CRUD)
- 📂 Quản lý danh mục (10 categories)
- 📋 Quản lý đơn hàng
- 👥 Quản lý người dùng
- 🎟️ Quản lý mã giảm giá/khuyến mãi
- 📈 Thống kê doanh thu, thuốc bán chạy
- 📧 Nhận thông báo email khi có đơn hàng mới

### 🚀 Tính năng nâng cao
- 🔄 Real-time validation
- 📱 Responsive design (Mobile-first)
- 🎨 UI/UX hiện đại với gradient & animations
- 🔒 Bảo mật: bcrypt (hash password), JWT, CORS, sanitization
- 📧 Email service (đăng ký, nâng cấp admin, đơn hàng)
- 💳 Tích hợp VietQR (chuyển khoản ngân hàng)
- 🛒 Guest cart (giỏ hàng khách vãng lai)

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

### 3. Cài đặt dependencies cho Frontend (optional)

Frontend không cần build tool, chỉ cần serve static files. Nếu dùng Live Server:

```bash
# Cài Live Server (VSCode extension) hoặc dùng extension tương tự
# Hoặc dùng Node.js serve:
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
| `EMAIL_PASSWORD` | App Password Gmail | `abcd efgh ijkl mnop` | Xem `EMAIL_SETUP.md` |
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

### 2. Khởi động Frontend

#### Cách 1: Dùng Live Server (VSCode) - Khuyên dùng ✅

1. Mở thư mục `Web` trong VSCode
2. Click phải vào `Web/user/index.html`
3. Chọn **"Open with Live Server"**

Frontend sẽ chạy tại: **http://127.0.0.1:5500** (hoặc port tương tự)

#### Cách 2: Dùng Node.js serve

```bash
cd Web
npx serve -s . -p 5500
```

#### Cách 3: Dùng Python

```bash
cd Web
# Python 3
python -m http.server 5500

# Python 2
python -m SimpleHTTPServer 5500
```

### 3. Truy cập ứng dụng

| Trang | URL |
|-------|-----|
| **Trang chủ User** | http://127.0.0.1:5500/user/index.html |
| **Đăng nhập** | http://127.0.0.1:5500/user/pages/login.html |
| **Admin Dashboard** | http://127.0.0.1:5500/admin/index.html |
| **Kích hoạt Admin** | http://127.0.0.1:5500/admin/activate.html |

---

## 📁 Cấu trúc thư mục

```
DACN/
├── Server/                    # Backend (Node.js + Express)
│   ├── controllers/           # Xử lý logic API
│   │   ├── userController.js
│   │   ├── drugControler.js
│   │   ├── ordersController.js
│   │   ├── invoiceController.js
│   │   ├── discountController.js
│   │   ├── cartController.js
│   │   ├── couponController.js
│   │   └── ...
│   ├── models/                # Schema MongoDB (Mongoose)
│   │   ├── userModel.js
│   │   ├── drugModel.js
│   │   ├── ordersModel.js
│   │   ├── invoiceModel.js
│   │   ├── discountModel.js
│   │   └── ...
│   ├── routers/               # Định tuyến API
│   │   ├── userRoutes.js
│   │   ├── drugRoutes.js
│   │   ├── ordersRouter.js
│   │   ├── invoiceRoutes.js
│   │   ├── discountRouters.js
│   │   ├── cartRoutes.js
│   │   ├── couponRoutes.js
│   │   └── ...
│   ├── middleware/            # Middleware (auth, validation)
│   │   └── authMiddleware.js
│   ├── services/              # Business logic
│   │   ├── ordersServices.js
│   │   └── emailService.js    # ✨ Email service
│   ├── src/
│   │   └── dbConfig.js        # Kết nối MongoDB
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
│       ├── components/
│       │   ├── topbar.html
│       │   ├── navbar.html    # ✨ Tự động load 10 categories
│       │   └── footer.html
│       └── images/
│           └── (logo, banners, etc.)
│
├── CATEGORY_PAGES.md          # 📖 Hướng dẫn thêm trang category
└── README.md                  # File này
```

---

## 🌐 API Endpoints

### 👤 User API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/users/register` | Đăng ký tài khoản | ❌ |
| POST | `/users/login` | Đăng nhập | ❌ |
| POST | `/users/activate-admin` | Kích hoạt Admin | ❌ |
| GET | `/users` | Lấy danh sách user | ✅ |
| GET | `/users/:id` | Lấy thông tin user | ✅ |
| PUT | `/users/:id` | Cập nhật user | ✅ |
| DELETE | `/users/:id` | Xóa user | ✅ |

### 💊 Drug API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/drugs` | Lấy tất cả thuốc | ❌ |
| GET | `/drugs/:id` | Lấy thông tin thuốc | ❌ |
| GET | `/drugs/code/:code` | Lấy thuốc theo mã | ❌ |
| GET | `/drugs/search?q=xxx` | Tìm kiếm thuốc | ❌ |
| GET | `/drugs/category/:categoryId` | Thuốc theo danh mục | ❌ |
| GET | `/drugs/low-stock?threshold=10` | Thuốc sắp hết hàng | ✅ |
| POST | `/drugs` | Thêm thuốc mới | ✅ |
| PUT | `/drugs/:id` | Cập nhật thuốc | ✅ |
| DELETE | `/drugs/:id` | Xóa thuốc | ✅ |

### 📂 Category API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/categories` | Lấy tất cả danh mục | ❌ |
| GET | `/categories/:id` | Lấy thông tin danh mục | ❌ |
| POST | `/categories` | Thêm danh mục | ✅ |
| PUT | `/categories/:id` | Cập nhật danh mục | ✅ |
| DELETE | `/categories/:id` | Xóa danh mục | ✅ |

### 📦 Order API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/orders` | Lấy tất cả đơn hàng | ✅ |
| GET | `/orders/my-orders` | Đơn hàng của tôi | ✅ |
| GET | `/orders/:id` | Chi tiết đơn hàng | ✅ |
| GET | `/orders/top/:period` | Top bán chạy (week/month/year) | ❌ |
| POST | `/orders` | Tạo đơn hàng | ❌ |
| PUT | `/orders/:id` | Cập nhật đơn hàng | ✅ |
| PUT | `/orders/:id/status` | Cập nhật trạng thái | ✅ |
| DELETE | `/orders/:id` | Xóa đơn hàng | ✅ |

### 🧾 Invoice API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/invoices` | Lấy tất cả hóa đơn | ✅ |
| GET | `/invoices/:id` | Chi tiết hóa đơn | ✅ |
| POST | `/invoices` | Tạo hóa đơn | ✅ |
| POST | `/invoices/:id/pay` | Thanh toán | ✅ |
| DELETE | `/invoices/:id` | Xóa hóa đơn | ✅ |

### 🎁 Discount API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/discounts` | Lấy tất cả mã giảm giá | ❌ |
| GET | `/discounts/:id` | Chi tiết mã | ❌ |
| POST | `/discounts` | Tạo mã giảm giá | ✅ |
| PUT | `/discounts/:id` | Cập nhật mã | ✅ |
| DELETE | `/discounts/:id` | Xóa mã | ✅ |

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

---

## 📖 Hướng dẫn sử dụng

### 1️⃣ Đăng ký & Đăng nhập

#### Người dùng (User)
1. Truy cập: http://127.0.0.1:5500/user/pages/login.html
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

#### Quản trị viên (Admin)
1. Đăng ký tài khoản như user (VD: `adminuser`)
2. Truy cập: http://127.0.0.1:5500/admin/activate.html
3. Nhập:
   - Tên đăng nhập: `adminuser`
   - Admin key: `MyS3cr3tAdm1nK3y` (hoặc key bạn đặt trong `.env`)
4. Click **"Kích hoạt Admin"**
5. ✅ Nhận email thông báo nâng cấp Admin
6. Đăng nhập lại với tài khoản Admin

**💡 Mẹo:** Key mặc định trong file mẫu là `MyS3cr3tAdm1nK3y`

### 2️⃣ Mua hàng (User)

1. **Xem sản phẩm:**
   - Trang chủ: http://127.0.0.1:5500/user/index.html
   - Tất cả thuốc: `/user/pages/drugs.html`
   - Theo danh mục:
     - Giảm đau - Hạ sốt: `/user/pages/pain-relief.html`
     - Kháng sinh: `/user/pages/antibiotics.html`
     - Vitamin: `/user/pages/vitamins.html`
     - Tiêu hóa: `/user/pages/digestive.html`
     - Cảm cúm - Dị ứng: `/user/pages/cold-flu.html`
     - Thực phẩm chức năng: `/user/pages/products.html`
     - Mẹ & Bé: `/user/pages/mom-baby.html`
     - Chăm sóc cá nhân: `/user/pages/personal-care.html`
     - Tim mạch - Huyết áp: `/user/pages/cardiovascular.html`
     - Dạ dày - Đường ruột: `/user/pages/stomach.html`

2. **Thêm vào giỏ:**
   - Click nút **"Thêm vào giỏ"** ở mỗi sản phẩm
   - Xem giỏ hàng: Click icon 🛒 ở topbar

3. **Thanh toán:**
   - Trong trang giỏ hàng, click **"Thanh toán"**
   - Điền thông tin giao hàng (có dropdown 63 tỉnh/thành VN)
   - Chọn phương thức thanh toán:
     - 💵 COD (Thanh toán khi nhận hàng)
     - 💳 Chuyển khoản ngân hàng (VietQR)
     - 💳 Thẻ tín dụng/ghi nợ
   - Áp dụng mã giảm giá (nếu có, VD: `SUMMER2024`)
   - Click **"Đặt hàng"**
   - ✅ Nhận email xác nhận đơn hàng

4. **Xem đơn hàng:**
   - Menu → **"Đơn hàng của tôi"** (`/user/pages/my-orders.html`)
   - Xem trạng thái:
     - 🟡 Pending (Chờ xử lý)
     - 🔵 Processing (Đang xử lý)
     - 🟢 Completed (Hoàn thành)
     - 🔴 Cancelled (Đã hủy)

5. **Quản lý tài khoản:**
   - Menu → **"Tài khoản"** (`/user/pages/profile.html`)
   - Cập nhật thông tin cá nhân
   - Quản lý địa chỉ giao hàng (thêm/sửa/xóa)
   - Đổi mật khẩu

### 3️⃣ Quản lý (Admin)

#### Dashboard
- Truy cập: http://127.0.0.1:5500/admin/index.html
- Xem tổng quan:
  - 💊 Tổng số thuốc
  - 📦 Tổng đơn hàng
  - 💰 Doanh thu (đã thanh toán)
  - 📊 Biểu đồ doanh thu 6 tháng
  - 🏆 Top thuốc bán chạy trong tháng

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

## 🔍 Troubleshooting

### Lỗi kết nối MongoDB

**Lỗi:**
```
❌ Error connecting to MongoDB: MongooseServerSelectionError
```

**Giải pháp:**
1. Kiểm tra `DB_USERNAME` và `DB_PASSWORD` trong `.env`
2. Đảm bảo IP của bạn được whitelist trong MongoDB Atlas:
   - Vào [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
   - Network Access → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
   - Hoặc thêm IP hiện tại
3. Kiểm tra URL connection string trong [`Server/src/dbConfig.js`](Server/src/dbConfig.js)
4. Đảm bảo MongoDB cluster đang chạy (không bị pause)

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
4. Nếu dùng `USE_ETHEREAL=true` (test mode):
   - Email không gửi thật
   - Xem link preview trong console log

### Đăng nhập thành công nhưng không redirect

**Giải pháp:**
1. Mở Developer Tools (F12) → Console
2. Kiểm tra response từ API `/users/login`:
   ```json
   {
     "success": true,
     "message": "Đăng nhập thành công",
     "user": {...},
     "token": "eyJhbGc..."
   }
   ```
3. Đảm bảo `is_active = true` trong database:
   ```javascript
   // Trong MongoDB Compass hoặc Atlas:
   db.users.findOne({ username: "testuser" })
   // Kiểm tra: is_active: true
   ```
4. Clear localStorage và thử lại:
   ```javascript
   // Trong Console
   localStorage.clear();
   location.reload();
   ```

### Thuốc trong kho không giảm khi đặt hàng

**Nguyên nhân:** Logic giảm stock bị trùng lặp ở 2 controller (đã fix).

**Giải pháp:** Đã khắc phục trong phiên bản hiện tại:
- ✅ Chỉ giảm stock trong [`invoiceController.createInvoice`](Server/controllers/invoiceController.js)
- ✅ [`ordersController.createOrder`](Server/controllers/ordersController.js) chỉ validate stock
- Nếu vẫn gặp lỗi, pull code mới nhất từ repo

### Không thấy ảnh sản phẩm

**Giải pháp:**
1. Kiểm tra trường `image` trong database có URL hợp lệ:
   ```
   https://example.com/images/paracetamol.jpg
   ```
2. Đảm bảo URL bắt đầu bằng `http://` hoặc `https://`
3. Nếu dùng local images:
   - Đặt trong `Web/shared/images/`
   - Dùng đường dẫn: `/shared/images/paracetamol.jpg`
4. Test URL trong trình duyệt xem có mở được không

### Lỗi "Invalid token" khi truy cập trang Admin

**Lỗi:**
```json
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

**Giải pháp:**
1. Token đã hết hạn (mặc định 7 ngày)
2. Đăng xuất và đăng nhập lại
3. Nếu vẫn lỗi, đổi `JWT_SECRET` trong `.env` và restart server

### Mã giảm giá không áp dụng được

**Giải pháp:**
1. Kiểm tra mã có tồn tại trong database: `/discounts`
2. Đảm bảo:
   - Mã chưa hết hạn (`end_date > now`)
   - Còn lượt sử dụng (`used_count < usage_limit`)
   - Mã đã kích hoạt (`is_active = true`)
3. Xem log server để biết lý do từ chối

---

## 🧪 Testing

### Test API bằng Postman/Thunder Client

#### 1. Đăng ký user (Dữ liệu mẫu)
```http
POST http://localhost:5000/users/register
Content-Type: application/json

{
  "username": "demo_user",
  "password": "Demo@1234",
  "full_name": "Người Dùng Demo",
  "email": "demo@example.com",
  "phone": "0901234567"
}
```

#### 2. Đăng nhập (Dữ liệu mẫu)
```http
POST http://localhost:5000/users/login
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

#### 3. Lấy danh sách thuốc
```http
GET http://localhost:5000/drugs
```

#### 4. Tìm kiếm thuốc (Dữ liệu mẫu)
```http
GET http://localhost:5000/drugs/search?q=paracetamol
```

#### 5. Tạo đơn hàng (Dữ liệu mẫu)
```http
POST http://localhost:5000/orders
Content-Type: application/json

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

#### 6. Áp dụng mã giảm giá (Dữ liệu mẫu)
```http
POST http://localhost:5000/coupons/redeem
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

#### 7. Kích hoạt Admin (Dữ liệu mẫu)
```http
POST http://localhost:5000/users/activate-admin
Content-Type: application/json

{
  "username": "demo_user",
  "admin_key": "MyS3cr3tAdm1nK3y"
}
```

#### 8. Lấy danh sách user (Cần token Admin)
```http
GET http://localhost:5000/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Test Frontend

#### Test đăng ký & đăng nhập
1. Mở http://127.0.0.1:5500/user/pages/login.html
2. Đăng ký với thông tin mẫu:
   - Username: `demo_user_2`
   - Password: `Demo@1234`
   - Email: `demo2@example.com`
   - Full Name: `Demo User 2`
3. Đăng nhập với tài khoản vừa tạo
4. Kiểm tra có redirect về trang chủ không

#### Test giỏ hàng
1. Vào trang thuốc bất kỳ
2. Click **"Thêm vào giỏ"**
3. Click icon 🛒 ở topbar
4. Kiểm tra giỏ hàng có sản phẩm không
5. Thử tăng/giảm số lượng
6. Thử xóa sản phẩm

#### Test checkout
1. Trong giỏ hàng, click **"Thanh toán"**
2. Điền thông tin mẫu:
   - Họ tên: `Nguyễn Văn Test`
   - SĐT: `0901234567`
   - Email: `test@example.com`
   - Tỉnh/Thành phố: `Hồ Chí Minh`
   - Quận/Huyện: `Quận 1`
   - Địa chỉ: `123 Đường ABC`
3. Chọn phương thức thanh toán: **COD**
4. Click **"Đặt hàng"**
5. Kiểm tra có redirect sang trang success không

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
- ✅ Thêm Email Service (đăng ký, nâng cấp admin, đơn hàng)
- ✅ Tích hợp VietQR cho thanh toán
- ✅ Thêm quản lý địa chỉ với 63 tỉnh/thành VN
- ✅ Thêm 10 trang category đầy đủ
- ✅ Cải thiện UI/UX (gradient, animations)
- ✅ Thêm trang khuyến mãi cho user
- ✅ Thêm trang thống kê chi tiết cho admin
- ✅ Fix bug giảm stock khi đặt hàng
- ✅ Cập nhật hướng dẫn sử dụng dữ liệu mẫu

### Version 1.0.0 (2024-01-15)
- ✅ Hoàn thiện hệ thống User & Admin
- ✅ CRUD đầy đủ cho Drug, Category, Order, User, Discount
- ✅ Giỏ hàng + Checkout flow
- ✅ Thống kê & biểu đồ
- ✅ UI/UX hiện đại với gradient & animations
- ✅ Responsive design

---

## 📜 License

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
1. Kiểm tra [Troubleshooting](#troubleshooting)
2. Xem [`Server/EMAIL_SETUP.md`](Server/EMAIL_SETUP.md) cho vấn đề email
3. Xem [`CATEGORY_PAGES.md`](CATEGORY_PAGES.md) để thêm trang category mới
4. Tạo [Issue](https://github.com/yourusername/DACN/issues) trên GitHub
5. Liên hệ qua email: Phucnguyenn0608@gmail.com

---

**Phiên bản:** 1.1.0  
**Cập nhật lần cuối:** 02/12/2024  
**Ngôn ngữ:** Tiếng Việt 🇻🇳
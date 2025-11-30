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

### 👤 Người dùng (User)
- 🛒 Xem danh sách thuốc theo danh mục
- 🔍 Tìm kiếm, lọc sản phẩm
- 🛍️ Thêm vào giỏ hàng, thanh toán
- 📦 Xem lịch sử đơn hàng
- 🎁 Áp dụng mã khuyến mãi

### 🔧 Quản trị viên (Admin)
- 📊 Dashboard với thống kê trực quan (Chart.js)
- 💊 Quản lý thuốc (CRUD)
- 📂 Quản lý danh mục
- 📋 Quản lý đơn hàng
- 👥 Quản lý người dùng
- 🎟️ Quản lý mã giảm giá/khuyến mãi
- 📈 Thống kê doanh thu, thuốc bán chạy

### 🚀 Tính năng nâng cao
- 🔄 Real-time validation
- 📱 Responsive design (Mobile-first)
- 🎨 UI/UX hiện đại với gradient & animations
- 🔒 Bảo mật: bcrypt (hash password), CORS, sanitization
- 📧 Notification system (toast messages)

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

### Nội dung file `.env`

```env
# ========== DATABASE ==========
# Thông tin MongoDB Atlas
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
# Ví dụ: DB_USERNAME=admin
#        DB_PASSWORD=MySecureP@ssw0rd

# ========== SERVER ==========
PORT=5000
# Port mà server sẽ chạy (mặc định: 5000)

# ========== JWT ==========
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES=7d
# Thời gian hết hạn token (7 ngày)

# ========== ADMIN ACTIVATION ==========
ADMIN_ACTIVATION_KEY=MyS3cr3tAdm1nK3y
# Key bảo mật để kích hoạt tài khoản Admin
# Thay đổi key này trong production!

# ========== ENVIRONMENT ==========
NODE_ENV=development
# development hoặc production
```

### Chi tiết từng biến:

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `DB_USERNAME` | Tên đăng nhập MongoDB Atlas | `admin` |
| `DB_PASSWORD` | Mật khẩu MongoDB Atlas | `MyPassword123!` |
| `PORT` | Cổng server chạy | `5000` |
| `JWT_SECRET` | Khóa bí mật mã hóa JWT token | `your_32_char_random_string` |
| `JWT_EXPIRES` | Thời gian token hết hạn | `7d` (7 ngày) |
| `ADMIN_ACTIVATION_KEY` | Key kích hoạt Admin | `MyS3cr3tAdm1nK3y` |
| `NODE_ENV` | Môi trường | `development` hoặc `production` |

### Lưu ý bảo mật:
- ⚠️ **KHÔNG commit file `.env`** lên Git
- ✅ File `.gitignore` đã bỏ qua `.env`
- 🔒 Thay đổi `JWT_SECRET` và `ADMIN_ACTIVATION_KEY` trong production

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
MongoDB connected successfully!
Server is running on http://localhost:5000
```

### 2. Khởi động Frontend

#### Cách 1: Dùng Live Server (VSCode)
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
│   │   └── ...
│   ├── middleware/            # Middleware (auth, validation)
│   │   └── authMiddleware.js
│   ├── services/              # Business logic
│   │   └── ordersServices.js
│   ├── src/
│   │   └── dbConfig.js        # Kết nối MongoDB
│   ├── .env                   # Biến môi trường (KHÔNG commit)
│   ├── .gitignore
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
│   │   │   ├── drugs.html
│   │   │   ├── products.html
│   │   │   ├── mom-baby.html
│   │   │   ├── personal-care.html
│   │   │   ├── promotions.html
│   │   │   ├── my-orders.html
│   │   │   ├── cart.html
│   │   │   ├── checkout.html
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
│       ├── include.js         # Component loader
│       ├── notification.js    # Toast notification
│       ├── components/
│       │   ├── topbar.html
│       │   ├── navbar.html
│       │   └── footer.html
│       └── images/
│           └── (logo, banners, etc.)
│
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
| GET | `/drugs/search?name=xxx` | Tìm kiếm thuốc | ❌ |
| GET | `/drugs/category/:categoryId` | Thuốc theo danh mục | ❌ |
| POST | `/drugs/add` | Thêm thuốc mới | ✅ |
| PUT | `/drugs/:id` | Cập nhật thuốc | ✅ |
| DELETE | `/drugs/:id` | Xóa thuốc | ✅ |

### 📂 Category API

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/categories` | Lấy tất cả danh mục | ❌ |
| GET | `/categories/:id` | Lấy thông tin danh mục | ❌ |
| POST | `/categories/add` | Thêm danh mục | ✅ |
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
   - Họ tên
   - Email
   - Tên đăng nhập
   - Mật khẩu (tối thiểu 8 ký tự)
4. Click **"Tạo tài khoản"**
5. Đăng nhập với tài khoản vừa tạo

**Mặc định:** Role = `user`, is_active = `true` (tự động kích hoạt)

#### Quản trị viên (Admin)
1. Đăng ký tài khoản như user
2. Truy cập: http://127.0.0.1:5500/admin/activate.html
3. Nhập:
   - Tên đăng nhập
   - Admin key: `MyS3cr3tAdm1nK3y` (hoặc key bạn đặt trong `.env`)
4. Click **"Kích hoạt Admin"**
5. Đăng nhập lại với tài khoản Admin

### 2️⃣ Mua hàng (User)

1. **Xem sản phẩm:**
   - Trang chủ: http://127.0.0.1:5500/user/index.html
   - Danh sách thuốc: `/user/pages/drugs.html`
   - Thực phẩm chức năng: `/user/pages/products.html`
   - Mẹ & Bé: `/user/pages/mom-baby.html`
   - Chăm sóc cá nhân: `/user/pages/personal-care.html`

2. **Thêm vào giỏ:**
   - Click nút **"Thêm vào giỏ"** ở mỗi sản phẩm
   - Xem giỏ hàng: Click icon 🛒 ở topbar

3. **Thanh toán:**
   - Trong trang giỏ hàng, click **"Thanh toán"**
   - Điền thông tin giao hàng
   - Chọn phương thức thanh toán (COD / Thẻ / Online)
   - Áp dụng mã giảm giá (nếu có)
   - Click **"Đặt hàng"**

4. **Xem đơn hàng:**
   - Menu → **"Đơn hàng của tôi"**
   - Xem trạng thái: Pending → Processing → Completed

### 3️⃣ Quản lý (Admin)

#### Dashboard
- Truy cập: http://127.0.0.1:5500/admin/index.html
- Xem tổng quan:
  - Tổng số thuốc
  - Tổng đơn hàng
  - Doanh thu
  - Biểu đồ doanh thu 6 tháng
  - Top thuốc bán chạy

#### Quản lý thuốc
1. Click **"Thuốc"** trong sidebar
2. **Thêm thuốc:**
   - Click **"Thêm thuốc mới"**
   - Điền thông tin (mã, tên, giá, tồn kho, danh mục)
   - Upload hình ảnh (URL)
   - Click **"Lưu"**
3. **Sửa/Xóa:** Click icon ✏️ hoặc 🗑️

#### Quản lý đơn hàng
1. Click **"Đơn hàng"** trong sidebar
2. Xem danh sách đơn hàng
3. **Cập nhật trạng thái:**
   - Click icon ✏️
   - Chọn trạng thái mới (Pending / Processing / Completed / Cancelled)
   - Click **"Lưu"**

#### Quản lý khuyến mãi
1. Click **"Khuyến mãi"** trong sidebar
2. **Thêm mã giảm giá:**
   - Click **"Thêm mã giảm giá mới"**
   - Điền thông tin:
     - Mã giảm giá (VD: SUMMER2024)
     - Phần trăm giảm (1-100%)
     - Ngày bắt đầu / kết thúc
     - Giới hạn lượt sử dụng
   - Click **"Lưu"**

---

## 🔍 Troubleshooting

### Lỗi kết nối MongoDB

**Lỗi:**
```
Error connecting to MongoDB: MongooseServerSelectionError
```

**Giải pháp:**
1. Kiểm tra `DB_USERNAME` và `DB_PASSWORD` trong `.env`
2. Đảm bảo IP của bạn được whitelist trong MongoDB Atlas:
   - Vào MongoDB Atlas Dashboard
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
3. Kiểm tra URL connection string trong `Server/src/dbConfig.js`

### Lỗi CORS

**Lỗi:**
```
Access to fetch at 'http://localhost:5000/...' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy
```

**Giải pháp:**
- Đảm bảo frontend chạy trên port 5500 (hoặc thêm port vào `allowedOrigins` trong `Server/server.js`)
- Kiểm tra middleware CORS đã được cấu hình đúng

### Không tải được component (topbar/navbar/footer)

**Lỗi:**
```
Không thể tải component.
```

**Giải pháp:**
1. Đảm bảo đường dẫn đúng trong attribute `data-include`
2. Chạy frontend qua HTTP server (KHÔNG mở trực tiếp file HTML)
3. Kiểm tra console để xem lỗi chi tiết

### Đăng nhập thành công nhưng không redirect

**Giải pháp:**
1. Mở Developer Tools (F12) → Console
2. Kiểm tra response từ API `/users/login`
3. Đảm bảo `is_active = true` trong database
4. Clear localStorage: `localStorage.clear()`

### Thuốc trong kho không giảm khi đặt hàng

**Nguyên nhân:** Logic giảm stock bị trùng lặp ở 2 controller.

**Giải pháp:** Đã fix trong phiên bản hiện tại:
- Chỉ giảm stock trong `invoiceController.createInvoice`
- `ordersController.createOrder` chỉ validate stock

### Không thấy ảnh sản phẩm

**Giải pháp:**
1. Kiểm tra trường `image` trong database có URL hợp lệ
2. Đảm bảo URL bắt đầu bằng `http://` hoặc `https://`
3. Nếu dùng local images, đặt trong `Web/shared/images/` và dùng đường dẫn `/shared/images/xxx.jpg`

---

## 🧪 Testing

### Test API bằng Postman/Thunder Client

#### 1. Đăng ký user
```http
POST http://localhost:5000/users/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test@1234",
  "full_name": "Test User",
  "email": "test@example.com",
  "phone": "0123456789"
}
```

#### 2. Đăng nhập
```http
POST http://localhost:5000/users/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test@1234"
}
```

#### 3. Lấy danh sách thuốc
```http
GET http://localhost:5000/drugs
```

#### 4. Tạo đơn hàng
```http
POST http://localhost:5000/orders
Content-Type: application/json

{
  "customer_id": 1,
  "order_items": [
    {
      "drug_id": 1,
      "drug_name": "Paracetamol 500mg",
      "quantity": 2,
      "price": 15000
    }
  ],
  "payment_method": "cash",
  "status": "Pending"
}
```

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

---

## 📝 Changelog

### Version 1.0.0 (2024-01-XX)
- ✅ Hoàn thiện hệ thống User & Admin
- ✅ CRUD đầy đủ cho Drug, Category, Order, User, Discount
- ✅ Giỏ hàng + Checkout flow
- ✅ Thống kê & biểu đồ
- ✅ UI/UX hiện đại với gradient & animations
- ✅ Fix bug giảm stock trùng lặp
- ✅ Responsive design

---

## 📜 License

MIT License - Xem file [LICENSE](LICENSE) để biết chi tiết.

---

## 👥 Team

- **Developer**: [Your Name]
- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

## 🙏 Cảm ơn

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Chart.js](https://www.chartjs.org/)
- [Boxicons](https://boxicons.com/)

---

**🎉 Happy Coding! 🎉**

Nếu gặp vấn đề, vui lòng tạo [Issue](https://github.com/yourusername/DACN/issues) hoặc liên hệ qua email.
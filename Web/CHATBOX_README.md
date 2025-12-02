# Chatbox Tư Vấn Khách Hàng

## Tính năng

✅ **Giao diện đẹp mắt, chuyên nghiệp**
- Floating button ở góc phải màn hình
- Animation mượt mà, hiện đại
- Badge thông báo tin nhắn mới

✅ **Tương tác thông minh với AI tìm kiếm thuốc**
- Tự động nhận diện từ khóa bệnh và triệu chứng
- Gọi API lấy danh sách thuốc theo danh mục
- Hiển thị thông tin sản phẩm: tên, giá, tình trạng kho
- Quick replies (6 câu hỏi nhanh)

✅ **Hỗ trợ 10 danh mục bệnh:**
1. 💊 Giảm đau - Hạ sốt (đau đầu, sốt, nhức đầu, đau răng...)
2. 💉 Kháng sinh (nhiễm trùng, viêm, viêm họng...)
3. 🍊 Vitamin & Khoáng chất (vitamin C, D, canxi, sắt...)
4. 🍵 Tiêu hóa (đầy hơi, khó tiêu, táo bón...)
5. 🤧 Cảm cúm - Dị ứng (cảm, cúm, ho, sổ mũi...)
6. 🌿 Thực phẩm chức năng (bổ sung, tăng cường...)
7. 🧴 Chăm sóc cá nhân (kem, sữa rửa mặt...)
8. 👶 Mẹ & Bé (sữa bột, tã, bỉm...)
9. ❤️ Tim mạch - Huyết áp (cao huyết áp, mỡ máu...)
10. 🩺 Dạ dày - Đường ruột (viêm dạ dày, trào ngược...)

✅ **Responsive hoàn toàn**
- Tối ưu cho desktop, tablet, mobile
- Full-screen trên mobile nhỏ

## Cách tích hợp vào trang HTML

### 1. Thêm CSS vào `<head>`
```html
<link rel="stylesheet" href="../shared/css/chatbox.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
```

### 2. Thêm JavaScript trước thẻ đóng `</body>`
```html
<script src="../shared/chatbox.js"></script>
```

### Ví dụ đầy đủ:
```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trang của bạn</title>
  
  <!-- CSS của trang -->
  <link rel="stylesheet" href="style.css">
  
  <!-- CSS Chatbox -->
  <link rel="stylesheet" href="../shared/css/chatbox.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</head>
<body>
  
  <!-- Nội dung trang của bạn -->
  
  <!-- JavaScript Chatbox -->
  <script src="../shared/chatbox.js"></script>
</body>
</html>
```

## Tính năng tự động trả lời

### 🔍 Tìm kiếm thuốc thông minh
Chatbox tự động nhận diện từ khóa bệnh/triệu chứng và gọi API để lấy danh sách thuốc:

**Ví dụ câu hỏi:**
- "Thuốc giảm đau đầu" → Hiển thị danh sách thuốc Giảm đau - Hạ sốt
- "Thuốc cảm cúm" → Hiển thị thuốc Cảm cúm - Dị ứng
- "Vitamin C" → Hiển thị Vitamin & Khoáng chất
- "Thuốc đau dạ dày" → Hiển thị thuốc Dạ dày - Đường ruột
- "Thuốc cao huyết áp" → Hiển thị thuốc Tim mạch - Huyết áp

**Thông tin hiển thị:**
- Tên thuốc
- Giá bán
- Tình trạng còn hàng/hết hàng
- Link xem chi tiết danh mục
- Hiển thị tối đa 5 sản phẩm + số lượng còn lại

### 💊 Tư vấn thuốc
- Từ khóa: "thuốc", "tư vấn"
- Trả lời: Hướng dẫn tư vấn và lưu ý về đơn thuốc

### 🎁 Khuyến mãi
- Từ khóa: "khuyến mãi", "giảm giá"
- Trả lời: Danh sách chương trình khuyến mãi hiện có

### 🛒 Đặt hàng
- Từ khóa: "đặt hàng", "mua"
- Trả lời: Hướng dẫn quy trình đặt hàng

### 📦 Kiểm tra đơn hàng
- Từ khóa: "đơn hàng", "kiểm tra"
- Trả lời: Link đến trang quản lý đơn hàng

### ⏰ Giờ hoạt động
- Từ khóa: "giờ", "mở cửa"
- Trả lời: Thông tin giờ phục vụ và thời gian giao hàng

### 📞 Liên hệ
- Từ khóa: "liên hệ", "hotline"
- Trả lời: Thông tin liên hệ đầy đủ

## Quick Replies (Câu trả lời nhanh)

Người dùng có thể click vào các button:
- 💊 Thuốc giảm đau
- 🤧 Thuốc cảm cúm
- 🍊 Vitamin
- 🍵 Tiêu hóa
- 📦 Đơn hàng
- 🎁 Khuyến mãi

## API Integration

Chatbox tích hợp với backend API:

**Endpoint:** `GET http://localhost:3000/api/drugs?category_id={id}`

**Flow:**
1. User nhập tin nhắn có từ khóa bệnh
2. Chatbox tìm category phù hợp từ 60+ từ khóa
3. Gọi API lấy danh sách thuốc theo category_id
4. Hiển thị kết quả với format đẹp mắt
5. Cung cấp link để xem toàn bộ danh mục

## Từ khóa được hỗ trợ

### Giảm đau - Hạ sốt
`đau, sốt, hạ sốt, giảm đau, đau đầu, nhức đầu, đau răng, đau bụng, đau lưng, đau khớp, sốt cao, sốt xuất huyết`

### Kháng sinh
`kháng sinh, nhiễm trùng, viêm, viêm họng, viêm amidan, nhiễm khuẩn, ho có đàm, amoxicillin`

### Vitamin & Khoáng chất
`vitamin, khoáng chất, bổ sung, tăng cường, sức khỏe, miễn dịch, canxi, sắt, kẽm, vitamin c, vitamin d`

### Tiêu hóa
`tiêu hóa, đầy hơi, khó tiêu, chướng bụng, táo bón, tiêu chảy, men tiêu hóa`

### Cảm cúm - Dị ứng
`cảm, cúm, cảm cúm, dị ứng, ngạt mũi, sổ mũi, hắt hơi, ho, viêm mũi, viêm xoang, ngứa mũi`

### Thực phẩm chức năng
`thực phẩm chức năng, tpcn, bổ, bồi bổ, sinh lý, mát gan, giải độc`

### Chăm sóc cá nhân
`chăm sóc, vệ sinh, kem, sữa rửa mặt, dầu gội, kem đánh răng, nước súc miệng`

### Mẹ & Bé
`mẹ, bé, em bé, trẻ em, sữa bột, tã, bỉm, bầu, mang thai, sau sinh`

### Tim mạch - Huyết áp
`tim, tim mạch, huyết áp, cao huyết áp, huyết áp cao, mạch máu, cholesterol, mỡ máu`

### Dạ dày - Đường ruột
`dạ dày, đường ruột, đau dạ dày, viêm dạ dày, loét dạ dày, trào ngược, ợ nóng, ợ chua`

## Tùy chỉnh

### Thay đổi màu sắc
Trong file `chatbox.css`, tìm và thay đổi gradient:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Thêm câu trả lời mới
Trong file `chatbox.js`, method `handleBotResponse()`, thêm điều kiện mới:
```javascript
else if (lowerMessage.includes('từ-khóa-của-bạn')) {
  response = 'Câu trả lời của bạn';
}
```

### Thay đổi thông tin liên hệ
Tìm và cập nhật trong method `handleBotResponse()`:
- Hotline: `1900-xxxx`
- Email: `support@drugstore.com`
- Địa chỉ: `123 Đường ABC, TP.HCM`

## Danh sách trang đã tích hợp

✅ `/Web/user/index.html` - Trang chủ

### Các trang cần tích hợp thêm:

- [ ] `/Web/user/pages/products.html`
- [ ] `/Web/user/pages/cart.html`
- [ ] `/Web/user/pages/checkout.html`
- [ ] `/Web/user/pages/my-orders.html`
- [ ] `/Web/user/pages/profile.html`
- [ ] `/Web/user/pages/promotions.html`
- [ ] Tất cả các trang category (antibiotics.html, vitamins.html, etc.)

## Browser Support

✅ Chrome, Edge, Firefox, Safari (modern versions)
✅ Mobile browsers
✅ Responsive design

## Notes

- Chatbox tự động hiển thị tin nhắn chào mừng sau 1 giây
- Badge thông báo chỉ hiển thị khi chatbox đóng
- Tất cả tin nhắn được lưu trong session (không persistent)
- Animation smooth và professional

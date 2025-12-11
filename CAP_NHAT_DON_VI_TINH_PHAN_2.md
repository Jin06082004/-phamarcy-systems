# Cập nhật Đơn vị tính - Phần 2: Checkout, Invoice và Orders

## 📋 Tổng quan
Phần 2 hoàn thiện hệ thống đơn vị tính (viên/vỉ/hộp) cho các chức năng:
- Giỏ hàng (Cart)
- Thanh toán (Checkout)
- Hóa đơn in (Invoice Print)
- Quản lý đơn hàng (Orders)

## 🔄 Các file đã cập nhật

### 1. Web/user/pages/cart.html
**Mục đích**: Hiển thị đơn vị trong giỏ hàng

**Thay đổi chính**:
```javascript
// Hiển thị đơn vị và giá theo đơn vị
const unitLabels = { pill: 'Viên', blister: 'Vỉ', box: 'Hộp' };
const unitPrice = item.unit_price || item.price || 0;
const unitLabel = item.unit ? unitLabels[item.unit] || item.unit : '';
const unitDisplay = unitLabel ? ` (${unitLabel})` : '';

// Gửi unit khi cập nhật/xóa
await cartAPI.updateItem(serverCart._id, { 
  drug_id: item.drug_id, 
  quantity: newQty,
  unit: item.unit // thêm unit
});
```

**Hiển thị**:
- Tên thuốc + đơn vị (Viên/Vỉ/Hộp)
- Đơn giá theo đơn vị: "50,000₫/Vỉ"
- Thành tiền = đơn giá × số lượng

---

### 2. Web/user/pages/checkout.html
**Mục đích**: Xử lý checkout với thông tin đơn vị

**Thay đổi chính**:

#### A. Hiển thị đơn hàng
```javascript
function renderCart() {
  container.innerHTML = cart.map(item => {
    const unitPrice = item.unit_price || item.price;
    const unitLabel = item.unit ? unitLabels[item.unit] || item.unit : '';
    
    return `
      <h4>${item.name}</h4>
      <p>
        ${unitLabel ? `Đơn vị: <strong>${unitLabel}</strong> | ` : ''}
        Số lượng: ${item.quantity} | 
        Đơn giá: ${unitPrice.toLocaleString()}₫
      </p>
    `;
  }).join('');
}
```

#### B. Tính tổng tiền
```javascript
function updateSummary() {
  subtotal = cart.reduce((sum, item) => {
    const unitPrice = item.unit_price || item.price;
    return sum + (unitPrice * item.quantity);
  }, 0);
}
```

#### C. Gửi order với unit
```javascript
const orderRes = await orderAPI.create({
  customer_id: user.user_id,
  order_items: cart.map(item => ({
    drug_id: item.drug_id,
    drug_name: item.name,
    quantity: item.quantity,
    price: item.unit_price || item.price,
    unit: item.unit // thêm unit
  })),
  ...
});

// Invoice data
const invoiceData = {
  items: cart.map(item => ({
    medicine_id: item.drug_id,
    name: item.name,
    quantity: item.quantity,
    unit_price: item.unit_price || item.price,
    total_price: (item.unit_price || item.price) * item.quantity,
    unit: item.unit // thêm unit
  })),
  ...
};
```

---

### 3. Web/pharmacist/js/invoice-print.js
**Mục đích**: Hiển thị đơn vị trên hóa đơn in

**Thay đổi chính**:
```javascript
function displayInvoice(invoice) {
  const unitLabels = { pill: 'Viên', blister: 'Vỉ', box: 'Hộp' };
  
  itemsBody.innerHTML = invoice.items.map((item, index) => {
    const unitLabel = item.unit ? unitLabels[item.unit] || item.unit : '';
    const unitDisplay = unitLabel ? ` (${unitLabel})` : '';
    
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}${unitDisplay}</td>
        <td>${formatCurrency(item.unit_price || 0)}</td>
        <td>${item.quantity}</td>
        <td>${formatCurrency(item.total_price || 0)}</td>
      </tr>
    `;
  }).join('');
}
```

**Kết quả in**:
```
STT | Tên thuốc                | Đơn giá    | SL | Thành tiền
1   | Paracetamol 500mg (Viên) | 500₫       | 10 | 5,000₫
2   | Vitamin C 1000mg (Vỉ)    | 50,000₫    | 2  | 100,000₫
```

---

### 4. Server/controllers/ordersController.js
**Mục đích**: Xử lý tồn kho theo đơn vị trong orders

**Thay đổi chính**:

#### A. Validate stock khi tạo order
```javascript
for (const item of order_items) {
  const drug = await Drug.findOne({ drug_id: item.drug_id });
  const unit = item.unit || 'pill';
  let availableStock = 0;
  
  if (drug.pricing && drug.pricing[unit]) {
    availableStock = drug.pricing[unit].stock || 0;
  } else {
    availableStock = drug.stock || 0; // fallback
  }
  
  if (availableStock < item.quantity) {
    return res.status(400).json({ 
      message: `Thuốc ${drug.name} (${unit}) không đủ số lượng. Còn ${availableStock}, cần ${item.quantity}` 
    });
  }
}
```

#### B. Hoàn trả stock khi hủy order
```javascript
if (status === "Cancelled" && currentOrder.status !== "Cancelled") {
  for (const item of currentOrder.order_items) {
    const drug = await Drug.findOne({ drug_id: item.drug_id });
    const unit = item.unit || 'pill';
    
    if (drug.pricing && drug.pricing[unit]) {
      drug.pricing[unit].stock += Number(item.quantity);
    } else {
      drug.stock += Number(item.quantity);
    }
    
    await drug.save();
    console.log(`✅ Hoàn trả ${item.quantity} ${drug.name} (${unit})`);
  }
}
```

#### C. Giảm stock khi kích hoạt lại order
```javascript
if (currentOrder.status === "Cancelled" && status !== "Cancelled") {
  for (const item of currentOrder.order_items) {
    const drug = await Drug.findOne({ drug_id: item.drug_id });
    const unit = item.unit || 'pill';
    
    if (drug.pricing && drug.pricing[unit]) {
      const availableStock = drug.pricing[unit].stock || 0;
      if (availableStock < item.quantity) {
        return res.status(400).json({ 
          message: `Không đủ tồn kho cho ${drug.name} (${unit})` 
        });
      }
      drug.pricing[unit].stock -= Number(item.quantity);
    } else {
      drug.stock -= Number(item.quantity);
    }
    
    await drug.save();
  }
}
```

---

### 5. Server/controllers/invoiceController.js
**Mục đích**: Xử lý tồn kho theo đơn vị trong invoices

**Thay đổi chính**:

#### A. Validate và fill item data
```javascript
for (const it of payload.items) {
  const drug = await drugModel.findOne({ drug_id: Number(it.medicine_id) });
  const unit = it.unit || 'pill';
  let availableStock = 0;
  let unitPrice = 0;
  
  if (drug.pricing && drug.pricing[unit]) {
    availableStock = drug.pricing[unit].stock || 0;
    unitPrice = drug.pricing[unit].price || 0;
  } else {
    availableStock = drug.stock || 0;
    unitPrice = drug.price || 0;
  }
  
  if (availableStock < Number(it.quantity)) {
    return res.status(400).json({ 
      message: `Không đủ tồn kho cho ${drug.name} (${unit})` 
    });
  }
  
  it.unit_price = Number(it.unit_price ?? unitPrice);
  it.unit = unit; // lưu unit vào item
}
```

#### B. Giảm stock sau khi tạo invoice
```javascript
for (const it of payload.items) {
  const drug = await drugModel.findOne({ drug_id: Number(it.medicine_id) });
  const unit = it.unit || 'pill';
  
  if (drug.pricing && drug.pricing[unit]) {
    const oldStock = drug.pricing[unit].stock;
    drug.pricing[unit].stock -= Number(it.quantity);
    await drug.save();
    console.log(`✅ Giảm ${it.quantity} ${drug.name} (${unit}): ${oldStock} → ${drug.pricing[unit].stock}`);
  } else {
    const oldStock = drug.stock;
    drug.stock -= Number(it.quantity);
    await drug.save();
    console.log(`✅ Giảm ${it.quantity} ${drug.name} (legacy): ${oldStock} → ${drug.stock}`);
  }
}
```

---

### 6. Server/models/ordersModel.js
**Mục đích**: Thêm field unit vào order items

**Thay đổi**:
```javascript
const orderItemSchema = new mongoose.Schema({
  drug_name: { type: String, required: true },
  drug_id: { type: Number, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  // 💊 Đơn vị (viên, vỉ, hộp)
  unit: {
    type: String,
    enum: ['pill', 'blister', 'box'],
    default: 'pill'
  }
});
```

---

### 7. Server/models/invoiceModel.js
**Mục đích**: Thêm field unit vào invoice items

**Thay đổi**:
```javascript
const lineItemSchema = new mongoose.Schema({
  medicine_id: { type: Number, required: true },
  name: { type: String, required: true, trim: true },
  unit_price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  discount: { type: Number, default: 0, min: 0 },
  total_price: { type: Number, required: true, min: 0 },
  batch_number: { type: String, default: "" },
  expiration_date: { type: Date },
  // 💊 Đơn vị (viên, vỉ, hộp)
  unit: {
    type: String,
    enum: ['pill', 'blister', 'box'],
    default: 'pill'
  }
}, { _id: false });
```

---

## 🔄 Luồng xử lý hoàn chỉnh

### 1. Người dùng mua hàng
```
Chọn sản phẩm + đơn vị (productDisplay.js)
  ↓
Thêm vào giỏ (cartController.js - với unit)
  ↓
Xem giỏ hàng (cart.html - hiển thị unit)
  ↓
Thanh toán (checkout.html - gửi unit trong order/invoice)
  ↓
Tạo order (ordersController - validate stock theo unit)
  ↓
Tạo invoice (invoiceController - giảm stock theo unit)
  ↓
In hóa đơn (invoice-print.js - hiển thị unit)
```

### 2. Quản lý tồn kho
```
Admin thêm thuốc với pricing{pill, blister, box}
  ↓
User mua 2 Vỉ (blister)
  ↓
System kiểm tra: pricing.blister.stock >= 2
  ↓
Nếu đủ: giảm pricing.blister.stock -= 2
  ↓
Nếu hủy order: hoàn trả pricing.blister.stock += 2
```

---

## ✅ Tính năng hoàn thiện

### Cart (Giỏ hàng)
- ✅ Hiển thị đơn vị sản phẩm
- ✅ Hiển thị giá theo đơn vị
- ✅ Cập nhật số lượng với unit
- ✅ Xóa item với unit

### Checkout (Thanh toán)
- ✅ Hiển thị đơn vị trong tóm tắt đơn hàng
- ✅ Tính tổng tiền theo unit_price
- ✅ Gửi unit trong order_items
- ✅ Gửi unit trong invoice items

### Invoice Print (In hóa đơn)
- ✅ Hiển thị đơn vị bên cạnh tên thuốc
- ✅ Format: "Paracetamol (Viên)"
- ✅ Tương thích với cả có và không có unit

### Orders (Đơn hàng)
- ✅ Validate tồn kho theo đơn vị
- ✅ Hoàn trả stock theo đơn vị khi hủy
- ✅ Giảm stock theo đơn vị khi kích hoạt lại
- ✅ Xóa order với hoàn trả stock đúng đơn vị

### Invoices (Hóa đơn)
- ✅ Validate stock theo đơn vị trước khi tạo
- ✅ Giảm stock theo đơn vị sau khi tạo
- ✅ Lưu unit vào invoice items
- ✅ Tương thích ngược với legacy stock

---

## 🧪 Test Cases

### Test 1: Mua hàng thành công
```
1. Chọn "Vitamin C 1000mg" - Đơn vị: Vỉ
2. Thêm 2 vỉ vào giỏ
3. Vào giỏ hàng → Thấy "Đơn vị: Vỉ | Giá: 50,000₫/Vỉ"
4. Thanh toán
5. Tạo order thành công
6. Stock giảm: pricing.blister.stock -= 2
7. In hóa đơn → Thấy "Vitamin C 1000mg (Vỉ)"
```

### Test 2: Không đủ tồn kho
```
1. Stock hiện tại: pricing.blister.stock = 1
2. Thêm 2 vỉ vào giỏ
3. Thanh toán
4. Lỗi: "Không đủ tồn kho cho Vitamin C (blister). Còn 1, cần 2"
```

### Test 3: Hủy đơn hàng
```
1. Tạo order với 2 vỉ Vitamin C
2. Stock giảm: 10 → 8
3. Admin hủy order
4. Stock hoàn trả: 8 → 10
5. Log: "✅ Hoàn trả 2 Vitamin C 1000mg (blister)"
```

### Test 4: Tương thích ngược
```
1. Thuốc cũ không có pricing object
2. Sử dụng drug.stock thay vì pricing.pill.stock
3. Tất cả chức năng vẫn hoạt động bình thường
```

---

## 📊 Database Schema Updates

### Orders Collection
```javascript
{
  order_id: 123,
  order_items: [
    {
      drug_id: 1,
      drug_name: "Paracetamol 500mg",
      quantity: 10,
      price: 500,
      unit: "pill" // NEW
    },
    {
      drug_id: 2,
      drug_name: "Vitamin C 1000mg",
      quantity: 2,
      price: 50000,
      unit: "blister" // NEW
    }
  ],
  total_amount: 105000,
  ...
}
```

### Invoices Collection
```javascript
{
  invoice_id: 456,
  items: [
    {
      medicine_id: 1,
      name: "Paracetamol 500mg",
      unit_price: 500,
      quantity: 10,
      total_price: 5000,
      unit: "pill" // NEW
    },
    {
      medicine_id: 2,
      name: "Vitamin C 1000mg",
      unit_price: 50000,
      quantity: 2,
      total_price: 100000,
      unit: "blister" // NEW
    }
  ],
  subtotal: 105000,
  ...
}
```

---

## 🎯 Kết quả

### Hoàn thiện 100% hệ thống đơn vị tính:
1. ✅ **Admin**: Quản lý giá và tồn kho theo 3 đơn vị
2. ✅ **User**: Chọn đơn vị khi mua, xem giá theo đơn vị
3. ✅ **Cart**: Hiển thị và quản lý items theo đơn vị
4. ✅ **Checkout**: Tính toán và thanh toán theo đơn vị
5. ✅ **POS**: Pharmacist bán hàng với đơn vị
6. ✅ **Orders**: Quản lý đơn hàng với tồn kho theo đơn vị
7. ✅ **Invoices**: Tạo và in hóa đơn với đơn vị
8. ✅ **Stock Management**: Giảm/hoàn trả tồn kho chính xác theo đơn vị

### Backward Compatibility:
- Thuốc cũ không có `pricing` vẫn hoạt động với `stock` cũ
- Các order/invoice cũ không có `unit` mặc định là `'pill'`
- Không cần migration data, hệ thống tự động xử lý

---

## 📝 Notes cho Developer

### Khi thêm thuốc mới:
```javascript
// PHẢI có cả 3 đơn vị
pricing: {
  pill: { price: 500, stock: 1000 },
  blister: { price: 5000, quantity_per_unit: 10, stock: 100 },
  box: { price: 50000, quantity_per_unit: 100, stock: 10 }
}
```

### Khi tạo order/invoice:
```javascript
// PHẢI include unit
{
  drug_id: 1,
  quantity: 2,
  price: 5000,
  unit: "blister" // BẮT BUỘC
}
```

### Khi cập nhật stock:
```javascript
// Sử dụng pricing[unit].stock
if (drug.pricing && drug.pricing[unit]) {
  drug.pricing[unit].stock -= quantity;
} else {
  drug.stock -= quantity; // fallback
}
```

---

**Tài liệu này bổ sung cho CAP_NHAT_DON_VI_TINH_HOAN_THANH.md**

Ngày cập nhật: ${new Date().toLocaleDateString('vi-VN')}

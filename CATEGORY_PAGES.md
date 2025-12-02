# Hướng dẫn thêm trang Category mới

## Cấu trúc danh mục hiện tại

Database có 10 categories:
1. Giảm đau - Hạ sốt (ID: 1)
2. Kháng sinh (ID: 2)
3. Vitamin & Khoáng chất (ID: 3)
4. Tiêu hóa (ID: 4)
5. Cảm cúm - Dị ứng (ID: 5)
6. **Thực phẩm chức năng (ID: 6)** ✅ Có trang
7. **Chăm sóc cá nhân (ID: 7)** ✅ Có trang
8. **Mẹ & Bé (ID: 8)** ✅ Có trang
9. Tim mạch - Huyết áp (ID: 9)
10. Dạ dày - Đường ruột (ID: 10)

## Cách thêm trang mới cho một category

### Bước 1: Tạo file HTML mới

Tạo file tại `Web/user/pages/` ví dụ: `pain-relief.html`

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Giảm đau - Hạ sốt - DrugStore</title>
    <link rel="stylesheet" href="../css/dashboard.css" />
  </head>
  <body>
    <div data-include="../../shared/components/topbar.html"></div>
    <div data-include="../../shared/components/navbar.html"></div>

    <main class="content">
      <section class="drugs-header">
        <h2>Giảm đau - Hạ sốt</h2>
        <p>Thuốc giảm đau, hạ sốt, chống viêm.</p>
      </section>

      <section style="padding: 30px 10%;">
        <div id="productList" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
          <div style="grid-column: 1/-1; text-align: center; padding: 40px;">Đang tải sản phẩm...</div>
        </div>
      </section>
    </main>

    <div data-include="../../shared/components/footer.html"></div>
    <script src="../../shared/include.js"></script>
    <script src="../../shared/notification.js"></script>

    <script type="module">
      import { drugAPI } from "../../shared/api.js";
      import { initAdminSecretButton } from "../../shared/adminButton.js";

      // Khởi tạo nút admin ẩn
      initAdminSecretButton('/Web/admin/drugs.html');
      
      // Category ID cố định cho "Giảm đau - Hạ sốt"
      const CATEGORY_ID = 1;  // ← Thay đổi số này
      
      let allProducts = [];

      async function loadProducts() {
        try {
          const drugsRes = await drugAPI.getAll();
          let products = Array.isArray(drugsRes) ? drugsRes : (drugsRes.data || []);
          
          // Lọc theo category_id
          products = products.filter(p => Number(p.category_id) === CATEGORY_ID);
          
          allProducts = products;

          const list = document.getElementById('productList');
          if (products.length === 0) {
            list.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #666;">Chưa có sản phẩm</div>';
            return;
          }
          
          list.innerHTML = products.map(p => {
            const escapedName = (p.name || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;');
            const escapedDesc = (p.description || 'Thuốc chất lượng cao').replace(/'/g, "\\\\'").replace(/"/g, '&quot;');
            
            let imgTag = '<div style="width:100%;height:180px;background:linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);display:flex;align-items:center;justify-content:center;flex-direction:column;color:#999;font-size:3rem;">💊<div style="font-size:0.875rem;margin-top:0.5rem;color:#666;">Chưa có ảnh</div></div>';
            
            if (p.image) {
              const isAbsolute = p.image.startsWith("http") || p.image.startsWith("/");
              const src = isAbsolute ? p.image : ("/shared/" + p.image.replace(/^(\\.\\//g, ""));
              imgTag = `<div style="position:relative;width:100%;height:180px;">
                <img src="${src}" alt="${escapedName}" style="width:100%;height:180px;object-fit:cover;background:#f5f5f5;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
                <div style="display:none;width:100%;height:180px;background:linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);align-items:center;justify-content:center;flex-direction:column;color:#999;font-size:3rem;position:absolute;top:0;left:0;">💊<div style="font-size:0.875rem;margin-top:0.5rem;color:#666;">Ảnh lỗi</div></div>
              </div>`;
            }
            
            return `
            <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="position: relative; width: 100%; height: 180px;">
                ${imgTag}
              </div>
              <div style="padding: 15px;">
                <h4 style="margin: 0 0 8px; color: #155724;">${p.name}</h4>
                <p style="margin: 0 0 10px; font-size: 13px; color: #666;">${escapedDesc}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: bold; color: #d32f2f;">${(p.price || 0).toLocaleString()}₫</span>
                  <button onclick="window.addToCart(${p.drug_id})" style="background: #4CAF50; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Thêm giỏ</button>
                </div>
              </div>
            </div>
          `;
          }).join('');
        } catch (error) {
          document.getElementById('productList').innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: red;">Lỗi tải dữ liệu</div>';
        }
      }
      
      window.addToCart = (id) => {
        const product = allProducts.find(p => p.drug_id === id);
        if (!product) {
          showNotification('Không tìm thấy sản phẩm', 'error');
          return;
        }
        
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.drug_id === id);
        if (existing) existing.quantity++;
        else cart.push({ drug_id: id, name: product.name, price: product.price, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification(`✅ Đã thêm "${product.name}" vào giỏ`, 'success');
      };

      loadProducts();
    </script>
  </body>
</html>
```

### Bước 2: Thêm vào `categoryConfig.js`

Mở file `Web/shared/categoryConfig.js` và thêm:

```javascript
export const categoryPageMap = {
  1: {
    url: '/Web/user/pages/pain-relief.html',  // ← File mới tạo
    name: 'Giảm đau - Hạ sốt',                 // ← Tên hiển thị
    icon: '💊'                                  // ← Icon (tùy chọn)
  },
  6: {
    url: '/Web/user/pages/products.html',
    name: 'Thực phẩm chức năng',
    icon: '💊'
  },
  // ... các category khác
};
```

### Bước 3: Xong!

Navbar sẽ tự động hiển thị menu mới. Không cần sửa code navbar.

## Lưu ý quan trọng

1. **Category ID phải khớp với database**
   - Kiểm tra ID trong `Server/data/categories-seed.json`
   
2. **Naming convention cho file**
   - Dùng kebab-case: `pain-relief.html`, `mom-baby.html`
   - Nên đặt tên ngắn gọn, dễ nhớ

3. **Template code**
   - Copy từ một trong 3 trang hiện có: `products.html`, `personal-care.html`, `mom-baby.html`
   - Chỉ cần thay đổi `CATEGORY_ID` và tiêu đề

4. **Testing**
   - Reload trang để xem navbar cập nhật
   - Kiểm tra xem có hiển thị đúng số lượng thuốc không

## Ví dụ nhanh

Muốn thêm trang "Cảm cúm - Dị ứng" (category_id = 5):

1. Tạo `Web/user/pages/cold-flu.html` (copy từ template trên)
2. Sửa `CATEGORY_ID = 5`
3. Thêm vào `categoryConfig.js`:
   ```javascript
   5: {
     url: '/Web/user/pages/cold-flu.html',
     name: 'Cảm cúm - Dị ứng',
     icon: '🤧'
   }
   ```
4. Done! ✅

## Troubleshooting

**Q: Navbar không hiển thị menu mới?**
- A: Kiểm tra Console có lỗi không. Hard refresh (Ctrl+Shift+R)

**Q: Trang mới không load thuốc?**
- A: Kiểm tra `CATEGORY_ID` có đúng không. Xem trong database có thuốc category đó không.

**Q: Muốn thay đổi thứ tự menu?**
- A: Thay đổi `category_id` trong `categoryConfig.js`. Menu tự động sort theo ID.

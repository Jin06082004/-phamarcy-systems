/**
 * productDisplay.js - Logic hiển thị sản phẩm với nhiều đơn vị
 * Sử dụng cho các trang user (antibiotics, cardiovascular, etc.)
 */

// Unit labels
const UNIT_LABELS = {
  pill: 'Viên',
  blister: 'Vỉ',
  box: 'Hộp'
};

// ✨ Store products globally để inline onclick handlers có thể access
let _currentProducts = [];

/**
 * Render danh sách sản phẩm với dropdown chọn đơn vị
 */
export function renderProducts(products, containerId = 'productList') {
  // Store products trong module scope
  _currentProducts = products || [];
  
  const list = document.getElementById(containerId);
  
  if (!products || products.length === 0) {
    list.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #666;">Chưa có sản phẩm</div>';
    return;
  }
  
  list.innerHTML = products.map(p => {
    const escapedName = (p.name || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const escapedDesc = (p.description || 'Thuốc chất lượng cao').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    
    // ✨ Lấy giá theo đơn vị mặc định
    const defaultUnit = p.default_unit || 'pill';
    const pricing = p.pricing || {
      pill: { price: p.price || 0, stock: p.stock || 0 }
    };
    
    const currentPrice = pricing[defaultUnit]?.price || p.price || 0;
    const currentStock = pricing[defaultUnit]?.stock || p.stock || 0;
    
    // Tạo options cho dropdown
    const unitOptions = Object.keys(pricing).map(unit => {
      const stock = pricing[unit].stock || 0;
      const label = UNIT_LABELS[unit] || unit;
      const selected = unit === defaultUnit ? 'selected' : '';
      return `<option value="${unit}" ${selected} ${stock <= 0 ? 'disabled' : ''}>${label} ${stock > 0 ? `(Còn ${stock})` : '(Hết hàng)'}</option>`;
    }).join('');
    
    // Image tag
    let imgTag = '<div style="width:100%;height:180px;background:linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);display:flex;align-items:center;justify-content:center;flex-direction:column;color:#999;font-size:3rem;">💊<div style="font-size:0.875rem;margin-top:0.5rem;color:#666;">Chưa có ảnh</div></div>';
    
    if (p.image) {
      const isAbsolute = p.image.startsWith("http") || p.image.startsWith("/");
      const src = isAbsolute ? p.image : ("/shared/" + p.image.replace(/^(\.\/|\/)+/, ""));
      imgTag = `<div style="position:relative;width:100%;height:180px;">
        <img src="${src}" alt="${escapedName}" style="width:100%;height:180px;object-fit:cover;background:#f5f5f5;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
        <div style="display:none;width:100%;height:180px;background:linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);align-items:center;justify-content:center;flex-direction:column;color:#999;font-size:3rem;position:absolute;top:0;left:0;">💊<div style="font-size:0.875rem;margin-top:0.5rem;color:#666;">Ảnh lỗi</div></div>
      </div>`;
    }
    
    return `
      <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
        ${imgTag}
        <div style="padding: 15px;">
          <h4 style="margin: 0 0 8px; color: #155724; font-size: 1rem;">${p.name}</h4>
          <p style="margin: 0 0 10px; font-size: 13px; color: #666; min-height: 38px;">${escapedDesc}</p>
          
          <!-- Dropdown chọn đơn vị -->
          <div style="margin-bottom: 10px;">
            <select id="unit-${p.drug_id}" onchange="updatePrice(${p.drug_id})" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9rem; cursor: pointer; background: white;">
              ${unitOptions}
            </select>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span id="price-${p.drug_id}" style="font-weight: bold; color: #d32f2f; font-size: 1.1rem;">${currentPrice.toLocaleString()}₫</span>
            <button onclick="addToCartWithUnit(${p.drug_id})" ${currentStock <= 0 ? 'disabled' : ''} style="background: ${currentStock > 0 ? '#4CAF50' : '#ccc'}; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: ${currentStock > 0 ? 'pointer' : 'not-allowed'}; font-weight: 600; transition: all 0.2s;" ${currentStock > 0 ? "onmouseover=\"this.style.background='#45a049'\" onmouseout=\"this.style.background='#4CAF50'\"" : ""}>
              ${currentStock > 0 ? '🛒 Thêm giỏ' : '❌ Hết hàng'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Cập nhật giá khi thay đổi đơn vị
 */
export function updatePrice(drugId) {
  // Tìm product từ stored products
  const product = _currentProducts.find(p => p.drug_id === drugId);
  if (!product) return;
  
  const selectedUnit = document.getElementById(`unit-${drugId}`).value;
  const pricing = product.pricing || { pill: { price: product.price || 0 } };
  const newPrice = pricing[selectedUnit]?.price || 0;
  
  document.getElementById(`price-${drugId}`).textContent = newPrice.toLocaleString() + '₫';
}

/**
 * Thêm vào giỏ hàng với đơn vị đã chọn
 */
export async function addToCartWithUnit(drugId) {
  const product = _currentProducts.find(p => p.drug_id === drugId);
  if (!product) {
    if (window.notification) {
      window.notification.error('Không tìm thấy sản phẩm');
    }
    return;
  }
  
  const selectedUnit = document.getElementById(`unit-${drugId}`).value;
  const pricing = product.pricing || { pill: { price: product.price || 0, stock: product.stock || 0 } };
  const unitData = pricing[selectedUnit];
  
  if (!unitData || unitData.stock <= 0) {
    if (window.notification) {
      window.notification.error('Sản phẩm đã hết hàng với đơn vị này');
    }
    return;
  }

  try {
    // ✅ KIỂM TRA USER ĐÃ LOGIN HAY CHƯA
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    
    let payload;
    
    if (user && user.user_id && token) {
      // ✅ ĐÃ LOGIN: Dùng user_id
      payload = {
        user_id: user.user_id,
        item: {
          drug_id: drugId,
          name: product.name,
          quantity: 1,
          unit: selectedUnit,
          unit_price: unitData.price,
          price: unitData.price
        }
      };
    } else {
      // ✅ CHƯA LOGIN: Dùng guest_token
      const guestToken = localStorage.getItem('guest_token') || 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('guest_token', guestToken);
      
      payload = {
        guest_token: guestToken,
        item: {
          drug_id: drugId,
          name: product.name,
          quantity: 1,
          unit: selectedUnit,
          unit_price: unitData.price,
          price: unitData.price
        }
      };
    }

    console.log('🛒 Adding to cart:', payload);

    const res = await fetch('http://localhost:5000/api/carts/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ✅ Gửi token nếu đã login
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const result = await res.json();
      console.log('✅ Cart updated:', result);
      
      if (window.notification) {
        window.notification.success(`✅ Đã thêm ${product.name} (${UNIT_LABELS[selectedUnit]}) vào giỏ hàng!`);
      }
      if (window.updateCartCount) {
        window.updateCartCount();
      }
    } else {
      const error = await res.json();
      console.error('❌ Add to cart error:', error);
      if (window.notification) {
        window.notification.error('Không thể thêm vào giỏ: ' + (error.message || 'Lỗi không xác định'));
      }
    }
  } catch (error) {
    console.error('❌ Lỗi thêm vào giỏ:', error);
    if (window.notification) {
      window.notification.error('Lỗi kết nối đến server');
    }
  }
}

// ✨ Expose functions vào window để inline onclick handlers có thể gọi
window.updatePrice = updatePrice;
window.addToCartWithUnit = addToCartWithUnit;

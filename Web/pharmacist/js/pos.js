/**
 * Pharmacist POS (Point of Sale) Script
 * Xử lý thanh toán tại quầy
 */

import { initPharmacistAuth, getCurrentUser } from './auth.js';

// API endpoints
const API_BASE = 'http://localhost:5000/api';

// State management
let allDrugs = [];
let cart = [];
let selectedPayment = 'cash';

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', async () => {
  // Kiểm tra quyền truy cập
  if (!initPharmacistAuth()) {
    return;
  }
  
  // Load products
  await loadProducts();
  
  // Setup event listeners
  setupEventListeners();
  
  // Setup sidebar toggle
  setupSidebarToggle();
});

// ========== LOAD PRODUCTS ==========
async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE}/drugs`);
    
    if (!response.ok) throw new Error('Failed to fetch drugs');
    
    const data = await response.json();
    allDrugs = Array.isArray(data) ? data : (data.data || []);
    
    renderProducts(allDrugs);
  } catch (error) {
    console.error('❌ Error loading drugs:', error);
    showError('Không thể tải danh sách thuốc');
  }
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  
  if (!grid) return;
  
  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--gray-600);">
        <i class='bx bx-search-alt' style="font-size: 4rem; color: var(--gray-300); margin-bottom: 16px;"></i>
        <p style="font-size: 1.1rem; margin: 0;">Không tìm thấy sản phẩm</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = products.map(p => {
    // ✨ Tính tổng tồn kho từ tất cả đơn vị
    const pricing = p.pricing || { pill: { price: p.price || 0, stock: p.stock || 0 } };
    const totalStock = (pricing.pill?.stock || 0) + (pricing.blister?.stock || 0) + (pricing.box?.stock || 0);
    
    const outOfStock = totalStock <= 0;
    const lowStock = totalStock > 0 && totalStock < 10;
    
    let stockBadge = '';
    if (outOfStock) {
      stockBadge = '<span class="badge badge-danger"><i class="bx bx-x-circle"></i> Hết hàng</span>';
    } else if (lowStock) {
      stockBadge = `<span class="badge badge-warning"><i class="bx bx-error-circle"></i> Còn ${totalStock}</span>`;
    } else {
      stockBadge = `<span class="badge badge-success"><i class="bx bx-check-circle"></i> Còn ${totalStock}</span>`;
    }
    
    // Hiển thị giá đơn vị mặc định
    const defaultUnit = p.default_unit || 'pill';
    const defaultPrice = pricing[defaultUnit]?.price || p.price || 0;
    
    return `
      <div class="product-card-pos ${outOfStock ? 'out-of-stock' : ''}" 
           ${outOfStock ? '' : `onclick="window.showUnitSelector(${p.drug_id})"`}>
        <div class="product-image ${!p.image ? 'product-no-image' : ''}">
          ${p.image ? `<img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">` : ''}
          ${!p.image ? `<i class='bx bx-capsule'></i>` : `<i class='bx bx-capsule' style='display:none'></i>`}
        </div>
        <div class="product-info">
          <h4>${p.name}</h4>
          <div class="product-meta">
            <span class="product-code"><i class='bx bx-barcode'></i> ${p.drug_code || 'N/A'}</span>
          </div>
          <div class="product-footer">
            <div class="price">${formatCurrency(defaultPrice)}</div>
            ${stockBadge}
          </div>
          ${!outOfStock ? '<div class="add-icon"><i class="bx bx-plus"></i></div>' : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ========== SEARCH PRODUCTS ==========
function setupSearch() {
  const searchInput = document.getElementById('search-product');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    
    if (!keyword) {
      renderProducts(allDrugs);
      return;
    }
    
    const filtered = allDrugs.filter(p => 
      p.name.toLowerCase().includes(keyword) || 
      (p.drug_code && p.drug_code.toLowerCase().includes(keyword))
    );
    
    renderProducts(filtered);
  });
}

// ========== CART FUNCTIONS ==========
// ✨ Modal chọn đơn vị
window.showUnitSelector = function(drugId) {
  const drug = allDrugs.find(d => d.drug_id === drugId);
  if (!drug) return;
  
  const pricing = drug.pricing || { pill: { price: drug.price || 0, stock: drug.stock || 0 } };
  const unitLabels = { pill: 'Viên', blister: 'Vỉ', box: 'Hộp' };
  
  const unitButtons = Object.keys(pricing).map(unit => {
    const data = pricing[unit];
    if (!data || data.stock <= 0) return '';
    
    return `
      <button onclick="window.addToCartWithUnit(${drugId}, '${unit}')" 
              style="padding: 16px; border: 2px solid #e5e7eb; border-radius: 12px; background: white; cursor: pointer; text-align: left; transition: all 0.2s; width: 100%; margin-bottom: 12px; display: block;"
              onmouseover="this.style.borderColor='#10b981'; this.style.background='#f0fdf4'"
              onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">
        <div style="font-weight: 600; color: #1f2937; font-size: 1.1rem; margin-bottom: 8px;">
          ${unit === 'pill' ? '💊' : '📦'} ${unitLabels[unit] || unit}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #6b7280; font-size: 0.9rem;">
            <i class="bx bx-package"></i> Còn ${data.stock}
          </span>
          <span style="color: #dc2626; font-weight: 700; font-size: 1.2rem;">${formatCurrency(data.price || 0)}</span>
        </div>
      </button>
    `;
  }).join('');
  
  if (!unitButtons) {
    showError('Sản phẩm đã hết hàng');
    return;
  }
  
  // Tạo modal custom
  const modal = document.createElement('div');
  modal.id = 'unit-selector-modal';
  modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
  
  modal.innerHTML = `
    <div style="background: white; padding: 28px; border-radius: 16px; max-width: 450px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #1f2937; font-size: 1.3rem;">
          <i class="bx bx-shopping-bag" style="color: #10b981;"></i>
          Chọn đơn vị - ${drug.name}
        </h3>
        <button onclick="this.closest('#unit-selector-modal').remove()" style="background: #f3f4f6; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; color: #6b7280; transition: all 0.2s;" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
          ✕
        </button>
      </div>
      <div style="margin-bottom: 16px;">
        ${unitButtons}
      </div>
      <button onclick="this.closest('#unit-selector-modal').remove()" style="width: 100%; padding: 12px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">
        Đóng
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
};

// ✨ Thêm vào giỏ với đơn vị
window.addToCartWithUnit = function(drugId, unit) {
  // Close modal first
  const modal = document.getElementById('unit-selector-modal');
  if (modal) modal.remove();
  
  const drug = allDrugs.find(d => d.drug_id === drugId);
  if (!drug) {
    showError('Không tìm thấy sản phẩm');
    return;
  }
  
  const pricing = drug.pricing || { pill: { price: drug.price || 0, stock: drug.stock || 0 } };
  const unitData = pricing[unit];
  
  if (!unitData || unitData.stock <= 0) {
    showError('Sản phẩm hết hàng với đơn vị này');
    return;
  }
  
  const unitLabels = { pill: 'Viên', blister: 'Vỉ', box: 'Hộp' };
  
  // Tìm item với cùng drug_id VÀ unit
  const existing = cart.find(item => item.drug_id === drugId && item.unit === unit);
  
  if (existing) {
    if (existing.quantity < unitData.stock) {
      existing.quantity++;
      showInfo(`Đã tăng số lượng ${drug.name} (${unitLabels[unit]})`);
    } else {
      showError(`Chỉ còn ${unitData.stock} ${unitLabels[unit].toLowerCase()}`);
      return;
    }
  } else {
    cart.push({
      drug_id: drug.drug_id,
      name: drug.name,
      unit: unit,
      unit_label: unitLabels[unit],
      price: unitData.price,
      quantity: 1,
      stock: unitData.stock
    });
    showInfo(`Đã thêm ${drug.name} (${unitLabels[unit]})`);
  }
  
  renderCart();
};

// DEPRECATED: Old addToCart function kept for compatibility
window.addToCart = function(drugId) {
  const drug = allDrugs.find(d => d.drug_id === drugId);
  
  if (!drug || drug.stock <= 0) {
    showError('Sản phẩm không khả dụng');
    return;
  }
  
  const existing = cart.find(item => item.drug_id === drugId);
  
  if (existing) {
    if (existing.quantity < drug.stock) {
      existing.quantity++;
    } else {
      showError(`Chỉ còn ${drug.stock} sản phẩm trong kho`);
      return;
    }
  } else {
    cart.push({
      drug_id: drug.drug_id,
      name: drug.name,
      price: drug.price || 0,
      quantity: 1,
      stock: drug.stock,
      unit: 'pill',
      unit_label: 'Viên'
    });
  }
  
  renderCart();
};

window.updateCartQty = function(drugId, unit, delta) {
  const item = cart.find(i => i.drug_id === drugId && i.unit === unit);
  if (!item) return;
  
  const newQty = item.quantity + delta;
  
  if (newQty <= 0) {
    removeFromCart(drugId, unit);
    return;
  }
  
  if (newQty > item.stock) {
    showError(`Chỉ còn ${item.stock} sản phẩm`);
    return;
  }
  
  item.quantity = newQty;
  renderCart();
};

window.removeFromCart = function(drugId, unit) {
  cart = cart.filter(item => !(item.drug_id === drugId && item.unit === unit));
  renderCart();
  showInfo('Đã xóa sản phẩm khỏi giỏ hàng');
};

function renderCart() {
  const container = document.getElementById('cart-items');
  const checkoutBtn = document.getElementById('btn-checkout');
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class='bx bx-cart-alt'></i>
        <p>Chưa có sản phẩm trong giỏ hàng</p>
        <small style="display: block; margin-top: 8px; color: var(--gray-600);">Chọn thuốc từ danh sách bên trái</small>
      </div>
    `;
    if (checkoutBtn) checkoutBtn.disabled = true;
    updateSummary();
    return;
  }
  
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-header">
        <span class="cart-item-name">
          ${item.name}
          ${item.unit_label ? `<br><small style="color: #6b7280; font-size: 0.85rem;">(${item.unit_label})</small>` : ''}
        </span>
        <button class="cart-item-remove" onclick="window.removeFromCart(${item.drug_id}, '${item.unit || 'pill'}')">
          <i class='bx bx-x'></i>
        </button>
      </div>
      <div class="cart-item-details">
        <div class="quantity-controls">
          <button onclick="window.updateCartQty(${item.drug_id}, '${item.unit || 'pill'}', -1)">
            <i class='bx bx-minus'></i>
          </button>
          <span>${item.quantity}</span>
          <button onclick="window.updateCartQty(${item.drug_id}, '${item.unit || 'pill'}', 1)">
            <i class='bx bx-plus'></i>
          </button>
        </div>
        <div class="cart-item-price">${formatCurrency(item.price * item.quantity)}</div>
      </div>
    </div>
  `).join('');
  
  if (checkoutBtn) checkoutBtn.disabled = false;
  updateSummary();
}

function updateSummary() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const totalEl = document.getElementById('total');
  if (totalEl) totalEl.textContent = formatCurrency(total);
}

// ========== PAYMENT METHOD ==========
function setupPaymentMethods() {
  document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
      this.classList.add('active');
      
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedPayment = radio.value;
      }
    });
  });
}

// ========== CLEAR CART ==========
function setupClearCart() {
  const clearBtn = document.getElementById('btn-clear');
  
  if (!clearBtn) return;
  
  clearBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      cart = [];
      renderCart();
      showInfo('Đã xóa giỏ hàng');
    }
  });
}

// ========== CHECKOUT ==========
async function handleCheckout() {
  if (cart.length === 0) {
    showError('Giỏ hàng trống');
    return;
  }
  
  // Disable checkout button to prevent double submission
  const checkoutBtn = document.getElementById('btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Đang xử lý...';
  }
  
  try {
    const customerName = document.getElementById('customer-name')?.value.trim() || 'Khách vãng lai';
    const customerPhone = document.getElementById('customer-phone')?.value.trim() || '';
    
    // Validate stock before checkout
    for (const item of cart) {
      const drug = allDrugs.find(d => d.drug_id === item.drug_id);
      if (!drug) {
        throw new Error(`Không tìm thấy thuốc: ${item.name}`);
      }
      if (drug.stock < item.quantity) {
        throw new Error(`Thuốc ${drug.name} chỉ còn ${drug.stock} sản phẩm trong kho`);
      }
    }
    
    // Map payment method
    const paymentMap = {
      cash: 'Tiền mặt',
      card: 'Thẻ ngân hàng',
      credit: 'Thẻ tín dụng'
    };
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = 0;
    const total = subtotal;
    
    // Get current pharmacist info
    const currentUser = getCurrentUser();
    const pharmacistId = currentUser?.user_id || currentUser?.id;
    
    // Prepare invoice data
    const invoiceData = {
      customer_name: customerName,
      customer_phone: customerPhone || 'Không có',
      pharmacist_id: pharmacistId,
      items: cart.map(item => ({
        medicine_id: item.drug_id,
        name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        discount: 0,
        total_price: item.price * item.quantity
      })),
      subtotal: subtotal,
      discount: 0,
      tax: tax,
      shipping_fee: 0,
      total: total,
      paid_amount: total,
      payment_method: paymentMap[selectedPayment] || 'Tiền mặt',
      status: 'paid',
      note: `Thanh toán tại quầy bởi ${currentUser?.full_name || currentUser?.name || 'Dược sĩ'}`
    };
    
    console.log('📝 Tạo hóa đơn:', invoiceData);
    
    // Create invoice
    const response = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(invoiceData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể tạo hóa đơn');
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.message || 'Không thể tạo hóa đơn');
    }
    
    console.log('✅ Hóa đơn đã tạo:', result.data);
    
    // Get invoice ID
    const invoiceId = result.data.invoice_id;
    
    if (!invoiceId) {
      throw new Error('Không nhận được mã hóa đơn');
    }
    
    // Clear cart
    cart = [];
    renderCart();
    
    // Clear customer info
    const nameInput = document.getElementById('customer-name');
    const phoneInput = document.getElementById('customer-phone');
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    
    // Reload products to update stock
    await loadProducts();
    
    // Redirect to print page after short delay
    setTimeout(() => {
      window.location.href = `invoice-print.html?id=${invoiceId}`;
    }, 1500);
    
  } catch (error) {
    console.error('❌ Lỗi thanh toán:', error);
    showError('Thanh toán thất bại: ' + error.message);
    
    // Re-enable checkout button
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = '<i class="bx bx-check-circle"></i> Thanh toán';
    }
  }
}

function setupCheckout() {
  const checkoutBtn = document.getElementById('btn-checkout');
  
  if (!checkoutBtn) return;
  
  checkoutBtn.addEventListener('click', handleCheckout);
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
  setupSearch();
  setupPaymentMethods();
  setupClearCart();
  setupCheckout();
}

// ========== UTILITY FUNCTIONS ==========
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

function formatCurrency(amount) {
  return (amount || 0).toLocaleString('vi-VN') + '₫';
}

function showSuccess(message) {
  if (window.notification) {
    notification.success(message);
  } else {
    alert('✅ ' + message);
  }
}

function showError(message) {
  if (window.notification) {
    notification.error(message);
  } else {
    alert('❌ ' + message);
  }
}

function showInfo(message) {
  if (window.notification) {
    notification.info(message);
  } else {
    alert('ℹ️ ' + message);
  }
}

// ========== SIDEBAR TOGGLE ==========
function setupSidebarToggle() {
  const toggleBtn = document.getElementById('toggleSidebar');
  const sidebar = document.querySelector('.sidebar');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }
}

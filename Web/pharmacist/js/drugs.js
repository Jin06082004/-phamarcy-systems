/**
 * Pharmacist Drugs Management Script
 * Xem và quản lý thuốc (read-only, không có quyền thêm/sửa/xóa)
 */

import { initPharmacistAuth, getCurrentUser } from './auth.js';

// API endpoints
const API_BASE = 'http://localhost:5000/api';

// State
let allDrugs = [];
let filteredDrugs = [];
let categories = [];
let currentPage = 1;
const itemsPerPage = 10;

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', async () => {
  // Kiểm tra quyền truy cập
  if (!initPharmacistAuth()) {
    return;
  }
  
  // Load data
  await Promise.all([
    loadCategories(),
    loadDrugs()
  ]);
  
  // Setup event listeners
  setupEventListeners();
  setupSidebarToggle();
});

// ========== LOAD DATA ==========
async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) {
      console.warn('⚠️ Cannot load categories');
      return;
    }
    
    const data = await response.json();
    categories = Array.isArray(data) ? data : (data.data || []);
    
    renderCategoryFilter();
  } catch (error) {
    console.error('❌ Error loading categories:', error);
  }
}

async function loadDrugs() {
  try {
    const response = await fetch(`${API_BASE}/drugs`);
    
    if (!response.ok) {
      throw new Error('Failed to load drugs');
    }
    
    const data = await response.json();
    allDrugs = Array.isArray(data) ? data : (data.data || []);
    filteredDrugs = [...allDrugs];
    
    renderTable();
  } catch (error) {
    console.error('❌ Error loading drugs:', error);
    showError('Không thể tải danh sách thuốc');
    
    document.getElementById('drugs-table-body').innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px; color: #ef4444;">
          <i class="bx bx-error-circle" style="font-size: 2rem;"></i>
          <p>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        </td>
      </tr>
    `;
  }
}

// ========== RENDER FUNCTIONS ==========
function renderCategoryFilter() {
  const select = document.getElementById('category-filter');
  if (!select) return;
  
  const options = categories.map(cat => 
    `<option value="${cat.category_id}">${cat.name}</option>`
  ).join('');
  
  select.innerHTML = `<option value="">Tất cả danh mục</option>${options}`;
}

function renderTable() {
  const tbody = document.getElementById('drugs-table-body');
  if (!tbody) return;
  
  if (filteredDrugs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px; color: #6b7280;">
          <i class="bx bx-search" style="font-size: 2rem;"></i>
          <p>Không tìm thấy thuốc nào</p>
        </td>
      </tr>
    `;
    return;
  }
  
  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDrugs = filteredDrugs.slice(startIndex, endIndex);
  
  tbody.innerHTML = paginatedDrugs.map(drug => {
    const stock = drug.stock || 0;
    let stockClass = 'badge-success';
    let stockIcon = '✅';
    
    if (stock === 0) {
      stockClass = 'badge-danger';
      stockIcon = '❌';
    } else if (stock < 10) {
      stockClass = 'badge-warning';
      stockIcon = '⚠️';
    }
    
    const categoryName = categories.find(c => c.category_id === drug.category_id)?.name || 'N/A';
    
    return `
      <tr>
        <td><strong>${drug.drug_code || 'N/A'}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            ${drug.image ? `<img src="${drug.image}" alt="${drug.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">` : ''}
            <span>${drug.name}</span>
          </div>
        </td>
        <td>${categoryName}</td>
        <td><strong style="color: #10b981;">${formatCurrency(drug.price || 0)}</strong></td>
        <td>
          <span class="badge ${stockClass}">
            ${stockIcon} ${stock}
          </span>
        </td>
        <td>${drug.unit || 'Viên'}</td>
        <td>
          ${drug.is_active ? '<span class="badge badge-success">Đang bán</span>' : '<span class="badge badge-secondary">Ngừng Bán</span>'}
        </td>
        <td>
          <button class="btn-icon" onclick="window.viewDrug(${drug.drug_id})" title="Xem chi tiết">
            <i class="bx bx-show"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
  
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredDrugs.length / itemsPerPage);
  const pagination = document.getElementById('pagination');
  
  if (!pagination || totalPages <= 1) {
    if (pagination) pagination.innerHTML = '';
    return;
  }
  
  let html = '<div class="pagination-buttons">';
  
  // Previous button
  html += `
    <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} 
            onclick="window.changePage(${currentPage - 1})">
      <i class="bx bx-chevron-left"></i>
    </button>
  `;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `
        <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                onclick="window.changePage(${i})">
          ${i}
        </button>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span class="pagination-ellipsis">...</span>`;
    }
  }
  
  // Next button
  html += `
    <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} 
            onclick="window.changePage(${currentPage + 1})">
      <i class="bx bx-chevron-right"></i>
    </button>
  `;
  
  html += '</div>';
  html += `<div class="pagination-info">Trang ${currentPage} / ${totalPages} (${filteredDrugs.length} thuốc)</div>`;
  
  pagination.innerHTML = html;
}

// ========== VIEW DRUG DETAILS ==========
window.viewDrug = async function(drugId) {
  const drug = allDrugs.find(d => d.drug_id === drugId);
  if (!drug) return;
  
  const modal = document.getElementById('view-modal');
  const modalBody = document.getElementById('modal-drug-details');
  const categoryName = categories.find(c => c.category_id === drug.category_id)?.name || 'N/A';
  const stock = drug.stock || 0;
  
  let stockBadge = '';
  if (stock === 0) {
    stockBadge = '<span class="badge badge-danger"><i class="bx bx-error"></i> Hết hàng</span>';
  } else if (stock < 10) {
    stockBadge = `<span class="badge badge-warning"><i class="bx bx-error-circle"></i> Sắp hết (${stock})</span>`;
  } else {
    stockBadge = `<span class="badge badge-success"><i class="bx bx-check-circle"></i> Còn hàng (${stock})</span>`;
  }
  
  modalBody.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      ${drug.image ? `
        <div style="text-align: center;">
          <img src="${drug.image}" alt="${drug.name}" 
               style="max-width: 300px; max-height: 300px; border-radius: 12px; box-shadow: var(--shadow-md);">
        </div>
      ` : ''}
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
        <div class="form-group">
          <label><i class='bx bx-barcode'></i> Mã thuốc</label>
          <input type="text" class="input-modern" value="${drug.drug_code || 'N/A'}" readonly>
        </div>
        
        <div class="form-group">
          <label><i class='bx bx-capsule'></i> Tên thuốc</label>
          <input type="text" class="input-modern" value="${drug.name}" readonly>
        </div>
        
        <div class="form-group">
          <label><i class='bx bx-category'></i> Danh mục</label>
          <input type="text" class="input-modern" value="${categoryName}" readonly>
        </div>
        
        <div class="form-group">
          <label><i class='bx bx-money'></i> Giá bán</label>
          <input type="text" class="input-modern" value="${formatCurrency(drug.price || 0)}" readonly>
        </div>
        
        <div class="form-group">
          <label><i class='bx bx-package'></i> Tồn kho</label>
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="text" class="input-modern" value="${stock} ${drug.unit || 'viên'}" readonly style="flex: 1;">
            ${stockBadge}
          </div>
        </div>
        
        <div class="form-group">
          <label><i class='bx bx-info-circle'></i> Trạng thái</label>
          <div style="display: flex; align-items: center; height: 46px;">
            ${drug.is_active ? 
              '<span class="badge badge-success"><i class="bx bx-check"></i> Đang bán</span>' : 
              '<span class="badge badge-secondary"><i class="bx bx-x"></i> Ngừng bán</span>'}
          </div>
        </div>
      </div>
      
      ${drug.description ? `
        <div class="form-group">
          <label><i class='bx bx-file-blank'></i> Mô tả / Hướng dẫn sử dụng</label>
          <textarea class="textarea-modern" readonly>${drug.description}</textarea>
        </div>
      ` : ''}
      
      ${drug.dosage ? `
        <div class="alert alert-info">
          <i class='bx bx-info-circle'></i>
          <div>
            <strong>Liều lượng:</strong> ${drug.dosage}
          </div>
        </div>
      ` : ''}
      
      ${stock < 10 && stock > 0 ? `
        <div class="alert alert-warning">
          <i class='bx bx-error-circle'></i>
          <div>
            <strong>Cảnh báo:</strong> Thuốc sắp hết! Còn ${stock} ${drug.unit || 'viên'}. Cần nhập thêm.
          </div>
        </div>
      ` : ''}
      
      ${stock === 0 ? `
        <div class="alert alert-danger">
          <i class='bx bx-error'></i>
          <div>
            <strong>Hết hàng!</strong> Thuốc này hiện không còn trong kho.
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  modal.classList.add('active');
};

window.closeViewModal = function() {
  const modal = document.getElementById('view-modal');
  modal.classList.remove('active');
};

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('view-modal');
  if (e.target === modal) {
    closeViewModal();
  }
});

// ========== FILTER & SEARCH ==========
function applyFilters() {
  const searchTerm = document.getElementById('search-input')?.value.toLowerCase().trim() || '';
  const categoryFilter = document.getElementById('category-filter')?.value || '';
  const stockFilter = document.getElementById('stock-filter')?.value || '';
  
  filteredDrugs = allDrugs.filter(drug => {
    // Search filter
    const matchSearch = !searchTerm || 
      drug.name.toLowerCase().includes(searchTerm) ||
      (drug.drug_code && drug.drug_code.toLowerCase().includes(searchTerm));
    
    // Category filter
    const matchCategory = !categoryFilter || drug.category_id === parseInt(categoryFilter);
    
    // Stock filter
    let matchStock = true;
    if (stockFilter === 'low') {
      matchStock = drug.stock > 0 && drug.stock < 10;
    } else if (stockFilter === 'out') {
      matchStock = drug.stock === 0;
    } else if (stockFilter === 'available') {
      matchStock = drug.stock > 0;
    }
    
    return matchSearch && matchCategory && matchStock;
  });
  
  currentPage = 1;
  renderTable();
}

// ========== PAGINATION ==========
window.changePage = function(page) {
  const totalPages = Math.ceil(filteredDrugs.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderTable();
  
  // Scroll to top
  document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' });
};

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(applyFilters, 300));
  }
  
  // Category filter
  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }
  
  // Stock filter
  const stockFilter = document.getElementById('stock-filter');
  if (stockFilter) {
    stockFilter.addEventListener('change', applyFilters);
  }
}

// ========== PAGINATION ==========
function formatCurrency(amount) {
  return (amount || 0).toLocaleString('vi-VN') + '₫';
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showSuccess(message) {
  if (window.notification) {
    notification.success(message);
  } else {
    console.log('✅', message);
  }
}

function showError(message) {
  if (window.notification) {
    notification.error(message);
  } else {
    console.error('❌', message);
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

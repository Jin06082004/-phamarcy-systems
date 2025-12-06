/**
 * Pharmacist Inventory Management
 * Quản lý tồn kho
 */

import { initPharmacistAuth } from './auth.js';

const API_BASE = 'http://localhost:5000/api';

let allDrugs = [];
let filteredDrugs = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (!initPharmacistAuth()) return;
  
  await loadInventory();
  setupEventListeners();
  setupSidebarToggle();
});

async function loadInventory() {
  try {
    const response = await fetch(`${API_BASE}/drugs`);
    if (!response.ok) throw new Error('Failed to load');
    
    const data = await response.json();
    allDrugs = Array.isArray(data) ? data : (data.data || []);
    filteredDrugs = [...allDrugs];
    
    updateStats();
    renderTable();
  } catch (error) {
    console.error('❌ Error:', error);
    document.getElementById('inventory-table-body').innerHTML = `
      <tr><td colspan="5" style="text-align: center; color: #ef4444;">Không thể tải dữ liệu</td></tr>
    `;
  }
}

function updateStats() {
  const outOfStock = allDrugs.filter(d => d.stock === 0).length;
  const lowStock = allDrugs.filter(d => d.stock > 0 && d.stock < 10).length;
  const inStock = allDrugs.filter(d => d.stock >= 10).length;
  
  document.getElementById('out-of-stock').textContent = outOfStock;
  document.getElementById('low-stock').textContent = lowStock;
  document.getElementById('in-stock').textContent = inStock;
}

function renderTable() {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;
  
  if (filteredDrugs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #6b7280;">Không tìm thấy</td></tr>';
    return;
  }
  
  tbody.innerHTML = filteredDrugs.map(drug => {
    const stock = drug.stock || 0;
    let statusBadge, statusText;
    
    if (stock === 0) {
      statusBadge = 'badge-danger';
      statusText = '❌ Hết hàng';
    } else if (stock < 10) {
      statusBadge = 'badge-warning';
      statusText = '⚠️ Sắp hết';
    } else {
      statusBadge = 'badge-success';
      statusText = '✅ Còn hàng';
    }
    
    return `
      <tr>
        <td><strong>${drug.drug_code || 'N/A'}</strong></td>
        <td>${drug.name}</td>
        <td><strong style="font-size: 1.1rem; color: ${stock === 0 ? '#ef4444' : stock < 10 ? '#f59e0b' : '#10b981'}">${stock}</strong></td>
        <td>${drug.unit || 'Viên'}</td>
        <td><span class="badge ${statusBadge}">${statusText}</span></td>
      </tr>
    `;
  }).join('');
}

function applyFilters() {
  const search = document.getElementById('search-input')?.value.toLowerCase().trim() || '';
  const stockFilter = document.getElementById('stock-filter')?.value || '';
  
  filteredDrugs = allDrugs.filter(drug => {
    const matchSearch = !search || 
      drug.name.toLowerCase().includes(search) ||
      (drug.drug_code && drug.drug_code.toLowerCase().includes(search));
    
    let matchStock = true;
    if (stockFilter === 'out') {
      matchStock = drug.stock === 0;
    } else if (stockFilter === 'low') {
      matchStock = drug.stock > 0 && drug.stock < 10;
    } else if (stockFilter === 'ok') {
      matchStock = drug.stock >= 10;
    }
    
    return matchSearch && matchStock;
  });
  
  renderTable();
}

function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  
  const stockFilter = document.getElementById('stock-filter');
  if (stockFilter) {
    stockFilter.addEventListener('change', applyFilters);
  }
}

function setupSidebarToggle() {
  const toggleBtn = document.getElementById('toggleSidebar');
  const sidebar = document.querySelector('.sidebar');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }
}

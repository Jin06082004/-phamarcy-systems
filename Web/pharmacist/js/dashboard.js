/**
 * Pharmacist Dashboard Script
 * Hiển thị thống kê cho dược sĩ
 */

import { initPharmacistAuth, getCurrentUser } from './auth.js';

// API endpoints
const API_BASE = 'http://localhost:5000/api';

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', async () => {
  // Kiểm tra quyền truy cập
  if (!initPharmacistAuth()) {
    return;
  }
  
  // Load statistics
  await loadDashboardStats();
  
  // Setup sidebar toggle
  setupSidebarToggle();
});

// ========== LOAD DASHBOARD STATISTICS ==========
async function loadDashboardStats() {
  try {
    // Load invoices
    const invoices = await fetchInvoices();
    
    // Load drugs
    const drugs = await fetchDrugs();
    
    // Calculate today's stats
    const today = new Date().toDateString();
    const todayInvoices = invoices.filter(inv => 
      new Date(inv.date || inv.createdAt).toDateString() === today
    );
    
    // Display today's invoice count
    document.getElementById('today-invoices').textContent = todayInvoices.length;
    
    // Calculate today's revenue
    const todayRevenue = todayInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    document.getElementById('today-revenue').textContent = formatCurrency(todayRevenue);
    
    // Count low stock drugs (less than 10)
    const lowStockCount = drugs.filter(d => d.stock < 10).length;
    document.getElementById('low-stock').textContent = lowStockCount;
    
  } catch (error) {
    console.error('❌ Error loading dashboard stats:', error);
    showError('Không thể tải thống kê');
  }
}

// ========== API FUNCTIONS ==========
async function fetchInvoices() {
  try {
    const response = await fetch(`${API_BASE}/invoices`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      console.warn('⚠️ Invoices endpoint not available:', response.status);
      return [];
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.error('❌ Error fetching invoices:', error.message);
    return [];
  }
}

async function fetchDrugs() {
  try {
    const response = await fetch(`${API_BASE}/drugs`);
    
    if (!response.ok) {
      console.warn('⚠️ Drugs endpoint not available:', response.status);
      return [];
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.error('❌ Error fetching drugs:', error.message);
    return [];
  }
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

function showError(message) {
  if (window.notification) {
    notification.error(message);
  } else {
    alert('❌ ' + message);
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

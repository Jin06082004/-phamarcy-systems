/**
 * Invoice Print Script
 * Hiển thị và in hóa đơn
 */

// API endpoints
const API_BASE = 'http://localhost:5000/api';

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', async () => {
  await loadInvoice();
});

// ========== LOAD INVOICE ==========
async function loadInvoice() {
  const urlParams = new URLSearchParams(window.location.search);
  const invoiceId = urlParams.get('id');
  
  if (!invoiceId) {
    showError('Không tìm thấy mã hóa đơn');
    setTimeout(() => window.location.href = 'pos.html', 2000);
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/invoices/${invoiceId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to fetch invoice');
    
    const data = await response.json();
    const invoice = data.data || data;
    
    if (!invoice) {
      showError('Không tìm thấy hóa đơn');
      return;
    }
    
    displayInvoice(invoice);
    
  } catch (error) {
    console.error('❌ Error loading invoice:', error);
    showError('Không thể tải hóa đơn: ' + error.message);
  }
}

// ========== DISPLAY INVOICE ==========
function displayInvoice(invoice) {
  console.log('📄 Hiển thị hóa đơn:', invoice);
  
  // Customer info
  const customerNameEl = document.getElementById('customer-name');
  const customerPhoneEl = document.getElementById('customer-phone');
  
  if (customerNameEl) {
    customerNameEl.textContent = invoice.customer_name || invoice.guest?.name || 'Khách vãng lai';
  }
  
  if (customerPhoneEl) {
    customerPhoneEl.textContent = invoice.customer_phone || invoice.guest?.phone || 'Không có';
  }
  
  // Invoice info
  const invoiceNumberEl = document.getElementById('invoice-number');
  const invoiceDateEl = document.getElementById('invoice-date');
  const pharmacistNameEl = document.getElementById('pharmacist-name');
  
  if (invoiceNumberEl) {
    invoiceNumberEl.textContent = invoice.invoice_number || `INV-${invoice.invoice_id}`;
  }
  
  if (invoiceDateEl) {
    const date = new Date(invoice.date || invoice.createdAt);
    invoiceDateEl.textContent = formatDateTime(date);
  }
  
  if (pharmacistNameEl) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    pharmacistNameEl.textContent = user.full_name || 'Dược sĩ';
  }
  
  // Invoice items with unit support
  const itemsBody = document.getElementById('invoice-items');
  const unitLabels = { pill: 'Viên', blister: 'Vỉ', box: 'Hộp' };
  
  if (itemsBody && invoice.items && invoice.items.length > 0) {
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
  
  // Summary
  const subtotalEl = document.getElementById('subtotal-print');
  const taxEl = document.getElementById('tax-print');
  const totalEl = document.getElementById('total-print');
  const paymentMethodEl = document.getElementById('payment-method');
  
  if (subtotalEl) subtotalEl.textContent = formatCurrency(invoice.subtotal || 0);
  if (taxEl) taxEl.textContent = formatCurrency(invoice.tax || 0);
  if (totalEl) totalEl.textContent = formatCurrency(invoice.total || 0);
  if (paymentMethodEl) paymentMethodEl.textContent = invoice.payment_method || 'Tiền mặt';
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

function formatDateTime(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
}

function showError(message) {
  if (window.notification) {
    notification.error(message);
  } else {
    alert('❌ ' + message);
  }
}

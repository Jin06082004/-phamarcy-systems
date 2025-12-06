/**
 * Pharmacist Authentication Middleware
 * Kiểm tra quyền truy cập cho dược sĩ và admin
 */

// Kiểm tra xem người dùng có phải là pharmacist hoặc admin không
export function checkPharmacistAuth() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Nếu không có user hoặc không phải pharmacist/admin
  if (!user.user_id || !user.role) {
    redirectToLogin();
    return false;
  }
  
  // Chỉ cho phép pharmacist và admin
  const allowedRoles = ['pharmacist', 'admin'];
  if (!allowedRoles.includes(user.role)) {
    alert('⚠️ Bạn không có quyền truy cập trang này!');
    redirectToDashboard(user.role);
    return false;
  }
  
  return true;
}

// Lấy thông tin user hiện tại
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user') || '{}');
}

// Redirect về trang login
function redirectToLogin() {
  window.location.href = '../user/pages/login.html';
}

// Redirect về dashboard tương ứng với role
function redirectToDashboard(role) {
  switch(role) {
    case 'admin':
      window.location.href = '../../admin/index.html';
      break;
    case 'user':
      window.location.href = '../../user/index.html';
      break;
    default:
      redirectToLogin();
  }
}

// Xử lý đăng xuất
export function handleLogout() {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    redirectToLogin();
  }
}

// Hiển thị tên dược sĩ
export function displayPharmacistName(elementId = 'pharmacist-name') {
  const user = getCurrentUser();
  const element = document.getElementById(elementId);
  
  if (element && user.full_name) {
    element.textContent = user.full_name;
  }
}

// Khởi tạo auth khi trang load
export function initPharmacistAuth() {
  // Kiểm tra quyền truy cập
  if (!checkPharmacistAuth()) {
    return false;
  }
  
  // Hiển thị tên dược sĩ
  displayPharmacistName();
  
  // Setup logout button
  const logoutBtn = document.getElementById('logout-link');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
  
  return true;
}

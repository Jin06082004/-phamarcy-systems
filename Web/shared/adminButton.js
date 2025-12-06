/**
 * Admin Secret Button - Hiển thị nút truy cập nhanh vào admin panel
 * Chỉ hiển thị khi user có role = 'admin'
 */

export function initAdminSecretButton(targetPage = '/Web/admin/index.html') {
  // Tạo button element
  const button = document.createElement('button');
  button.id = 'admin-secret-btn';
  button.innerHTML = '⚙️';
  button.title = 'Truy cập trang quản lý (Admin only)';
  button.style.cssText = `
    display: none;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
    z-index: 1000;
    transition: all 0.3s ease;
    opacity: 0.85;
  `;

  // Hover effects
  button.addEventListener('mouseenter', () => {
    button.style.opacity = '1';
    button.style.transform = 'scale(1.1) rotate(5deg)';
    button.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.5)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.opacity = '0.85';
    button.style.transform = 'scale(1) rotate(0deg)';
    button.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)';
  });

  // Click handler
  button.addEventListener('click', async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      if (window.notification) {
        window.notification.error('Vui lòng đăng nhập lại');
      } else {
        alert('Vui lòng đăng nhập lại');
      }
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        if (window.notification) {
          window.notification.error('Bạn không có quyền truy cập');
        } else {
          alert('Bạn không có quyền truy cập');
        }
        return;
      }

      // Loading effect
      button.innerHTML = '⏳';
      button.style.pointerEvents = 'none';

      setTimeout(() => {
        window.location.href = targetPage;
      }, 800);

    } catch (e) {
      console.error('Admin button error:', e);
      button.innerHTML = '⚙️';
      button.style.pointerEvents = 'auto';
      if (window.notification) {
        window.notification.error('Có lỗi xảy ra');
      }
    }
  });

  // Append to body
  document.body.appendChild(button);

  // Check if user is admin
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') {
        button.style.display = 'block';
        console.log('🔓 Admin button activated for:', user.username);
        
        // Animation
        setTimeout(() => {
          button.style.animation = 'slideInRight 0.5s ease-out';
        }, 500);
      } else {
        console.log('👤 User role:', user.role, '- Admin button hidden');
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }

  return button;
}

// CSS Animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 0.85;
    }
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
    }
    50% {
      box-shadow: 0 8px 32px rgba(239, 68, 68, 0.6);
    }
  }

  #admin-secret-btn {
    animation: pulse 2s infinite;
  }

  #admin-secret-btn:active {
    transform: scale(0.95) !important;
  }

  @media (max-width: 768px) {
    #admin-secret-btn {
      width: 50px !important;
      height: 50px !important;
      font-size: 20px !important;
      bottom: 15px !important;
      right: 15px !important;
    }
  }
`;
document.head.appendChild(style);

/**
 * User Back Button - Hiển thị nút quay lại trang user từ admin panel
 * Chỉ hiển thị khi đang ở trang admin
 */

export function initUserBackButton(targetPage = '/Web/user/index.html') {
  // Tạo button element
  const button = document.createElement('button');
  button.id = 'user-back-btn';
  button.innerHTML = '🏠';
  button.title = 'Quay lại trang người dùng';
  button.style.cssText = `
    display: block;
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    z-index: 1000;
    transition: all 0.3s ease;
    opacity: 0.85;
  `;

  // Hover effects
  button.addEventListener('mouseenter', () => {
    button.style.opacity = '1';
    button.style.transform = 'scale(1.1) rotate(-5deg)';
    button.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.5)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.opacity = '0.85';
    button.style.transform = 'scale(1) rotate(0deg)';
    button.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)';
  });

  // Click handler
  button.addEventListener('click', async () => {
    // Loading effect
    button.innerHTML = '⏳';
    button.style.pointerEvents = 'none';

    setTimeout(() => {
      window.location.href = targetPage;
    }, 800);
  });

  // Append to body
  document.body.appendChild(button);

  // Animation khi xuất hiện
  setTimeout(() => {
    button.style.animation = 'slideInRight 0.5s ease-out';
  }, 500);

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

  @keyframes pulseBlue {
    0%, 100% {
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    }
    50% {
      box-shadow: 0 8px 32px rgba(59, 130, 246, 0.6);
    }
  }

  #user-back-btn {
    animation: pulseBlue 2s infinite;
  }

  #user-back-btn:active {
    transform: scale(0.95) !important;
  }

  @media (max-width: 768px) {
    #user-back-btn {
      width: 50px !important;
      height: 50px !important;
      font-size: 20px !important;
      bottom: 80px !important;
      right: 15px !important;
    }
  }
`;
document.head.appendChild(style);

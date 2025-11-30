// Modern Notification System
class NotificationModal {
  constructor() {
    this.createModal();
  }

  createModal() {
    // Remove existing modal if any
    const existing = document.getElementById('notification-modal');
    if (existing) existing.remove();

    // Create modal HTML
    const modalHTML = `
      <div id="notification-modal" class="notification-modal">
        <div class="notification-overlay"></div>
        <div class="notification-content">
          <div class="notification-icon"></div>
          <h3 class="notification-title"></h3>
          <p class="notification-message"></p>
          <div class="notification-actions"></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('notification-modal');
    this.overlay = this.modal.querySelector('.notification-overlay');
    
    // Close on overlay click
    this.overlay.addEventListener('click', () => this.close());
  }

  show({ type = 'info', title, message, confirmText = 'OK', cancelText = 'Hủy', onConfirm, onCancel }) {
    const iconElement = this.modal.querySelector('.notification-icon');
    const titleElement = this.modal.querySelector('.notification-title');
    const messageElement = this.modal.querySelector('.notification-message');
    const actionsElement = this.modal.querySelector('.notification-actions');

    // Set icon based on type
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      question: '❓'
    };
    iconElement.textContent = icons[type] || icons.info;
    iconElement.className = `notification-icon icon-${type}`;

    // Set content
    titleElement.textContent = title;
    
    // Support HTML content for message
    if (message.includes('<')) {
      messageElement.innerHTML = message;
    } else {
      messageElement.textContent = message;
    }

    // Create buttons
    actionsElement.innerHTML = '';
    
    if (onCancel) {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'notification-btn btn-cancel';
      cancelBtn.textContent = cancelText;
      cancelBtn.onclick = () => {
        onCancel();
        this.close();
      };
      actionsElement.appendChild(cancelBtn);
    }

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'notification-btn btn-confirm';
    confirmBtn.textContent = confirmText;
    confirmBtn.onclick = () => {
      if (onConfirm) onConfirm();
      this.close();
    };
    actionsElement.appendChild(confirmBtn);

    // Show modal with animation
    this.modal.classList.add('show');
    
    // Focus confirm button
    setTimeout(() => confirmBtn.focus(), 100);

    // Return promise for await support
    return new Promise((resolve) => {
      confirmBtn.onclick = () => {
        if (onConfirm) onConfirm();
        this.close();
        resolve(true);
      };
      
      if (onCancel) {
        const cancelBtn = actionsElement.querySelector('.btn-cancel');
        cancelBtn.onclick = () => {
          if (onCancel) onCancel();
          this.close();
          resolve(false);
        };
      }
    });
  }

  close() {
    this.modal.classList.remove('show');
  }

  // Helper methods
  success(message, title = '✨ Thành công!') {
    return this.show({ type: 'success', title, message });
  }

  error(message, title = '❌ Lỗi!') {
    return this.show({ type: 'error', title, message });
  }

  warning(message, title = '⚠️ Cảnh báo!') {
    return this.show({ type: 'warning', title, message });
  }

  info(message, title = 'ℹ️ Thông tin') {
    return this.show({ type: 'info', title, message });
  }

  confirm(message, title = '❓ Xác nhận') {
    return this.show({
      type: 'question',
      title,
      message,
      confirmText: 'Xác nhận',
      cancelText: 'Hủy',
      onCancel: () => {}
    });
  }
}

// Create global instance
window.notification = new NotificationModal();

// Override alert and confirm
window.alert = (message) => {
  return window.notification.info(message);
};

window.confirm = (message) => {
  return window.notification.confirm(message);
};

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
  .notification-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .notification-modal.show {
    opacity: 1;
    pointer-events: all;
  }

  .notification-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
  }

  .notification-content {
    position: relative;
    background: white;
    border-radius: 24px;
    padding: 2.5rem;
    max-width: 600px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    transform: scale(0.9);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    text-align: center;
  }

  .notification-modal.show .notification-content {
    transform: scale(1);
  }

  .notification-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    animation: bounceIn 0.6s ease;
  }

  @keyframes bounceIn {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  .icon-success {
    filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.3));
  }

  .icon-error {
    filter: drop-shadow(0 4px 12px rgba(239, 68, 68, 0.3));
  }

  .icon-warning {
    filter: drop-shadow(0 4px 12px rgba(245, 158, 11, 0.3));
  }

  .icon-info {
    filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3));
  }

  .icon-question {
    filter: drop-shadow(0 4px 12px rgba(139, 92, 246, 0.3));
  }

  .notification-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .notification-message {
    font-size: 1.125rem;
    color: #6b7280;
    line-height: 1.7;
    margin-bottom: 2rem;
  }

  .notification-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .notification-btn {
    padding: 0.875rem 2rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    min-width: 120px;
  }

  .btn-confirm {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  }

  .btn-confirm:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  .btn-confirm:active {
    transform: translateY(0);
  }

  .btn-cancel {
    background: white;
    color: #6b7280;
    border: 2px solid #e5e7eb;
  }

  .btn-cancel:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-2px);
  }

  .btn-cancel:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    .notification-content {
      padding: 2rem 1.5rem;
      width: 95%;
    }

    .notification-icon {
      font-size: 3rem;
    }

    .notification-title {
      font-size: 1.5rem;
    }

    .notification-message {
      font-size: 1rem;
    }

    .notification-actions {
      flex-direction: column;
    }

    .notification-btn {
      width: 100%;
    }
  }
`;
document.head.appendChild(style);

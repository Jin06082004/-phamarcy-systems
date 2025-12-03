// Chatbox tư vấn khách hàng

class Chatbox {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.API_URL = 'http://localhost:5000';
    this.isFetching = false;
    
    // Cấu hình danh mục và từ khóa liên quan
    this.categoryKeywords = {
      1: {
        name: 'Giảm đau - Hạ sốt',
        keywords: ['đau', 'sốt', 'hạ sốt', 'giảm đau', 'đau đầu', 'nhức đầu', 'đau răng', 'đau bụng', 'đau lưng', 'đau khớp', 'sốt cao', 'sốt xuất huyết'],
        icon: '💊'
      },
      2: {
        name: 'Kháng sinh',
        keywords: ['kháng sinh', 'nhiễm trùng', 'viêm', 'viêm họng', 'viêm amidan', 'nhiễm khuẩn', 'ho có đàm', 'amoxicillin'],
        icon: '💉'
      },
      3: {
        name: 'Vitamin & Khoáng chất',
        keywords: ['vitamin', 'khoáng chất', 'bổ sung', 'tăng cường', 'sức khỏe', 'miễn dịch', 'canxi', 'sắt', 'kẽm', 'vitamin c', 'vitamin d'],
        icon: '🍊'
      },
      4: {
        name: 'Tiêu hóa',
        keywords: ['tiêu hóa', 'đầy hơi', 'khó tiêu', 'chướng bụng', 'táo bón', 'tiêu chảy', 'men tiêu hóa'],
        icon: '🍵'
      },
      5: {
        name: 'Cảm cúm - Dị ứng',
        keywords: ['cảm', 'cúm', 'cảm cúm', 'dị ứng', 'ngạt mũi', 'sổ mũi', 'hắt hơi', 'ho', 'viêm mũi', 'viêm xoang', 'ngứa mũi'],
        icon: '🤧'
      },
      6: {
        name: 'Thực phẩm chức năng',
        keywords: ['thực phẩm chức năng', 'tpcn', 'bổ', 'bồi bổ', 'sinh lý', 'mát gan', 'giải độc'],
        icon: '🌿'
      },
      7: {
        name: 'Chăm sóc cá nhân',
        keywords: ['chăm sóc', 'vệ sinh', 'kem', 'sữa rửa mặt', 'dầu gội', 'kem đánh răng', 'nước súc miệng'],
        icon: '🧴'
      },
      8: {
        name: 'Mẹ & Bé',
        keywords: ['mẹ', 'bé', 'em bé', 'trẻ em', 'sữa bột', 'tã', 'bỉm', 'bầu', 'mang thai', 'sau sinh'],
        icon: '👶'
      },
      9: {
        name: 'Tim mạch - Huyết áp',
        keywords: ['tim', 'tim mạch', 'huyết áp', 'cao huyết áp', 'huyết áp cao', 'mạch máu', 'cholesterol', 'mỡ máu'],
        icon: '❤️'
      },
      10: {
        name: 'Dạ dày - Đường ruột',
        keywords: ['dạ dày', 'đường ruột', 'đau dạ dày', 'viêm dạ dày', 'loét dạ dày', 'trào ngược', 'ợ nóng', 'ợ chua'],
        icon: '🩺'
      }
    };
    
    this.init();
  }

  init() {
    this.createChatbox();
    this.attachEventListeners();
    this.loadWelcomeMessage();
  }

  createChatbox() {
    const chatboxHTML = `
      <!-- Chatbox Button -->
      <div class="chatbox-button" id="chatboxButton">
        <i class="fas fa-comments"></i>
        <span class="chatbox-badge" id="chatboxBadge">1</span>
      </div>

      <!-- Chatbox Container -->
      <div class="chatbox-container" id="chatboxContainer">
        <div class="chatbox-header">
          <div class="chatbox-header-content">
            <div class="chatbox-avatar">
              <i class="fas fa-user-nurse"></i>
            </div>
            <div class="chatbox-info">
              <h4>Tư Vấn Viên</h4>
              <span class="chatbox-status">
                <span class="status-dot"></span>
                Đang hoạt động
              </span>
            </div>
          </div>
          <button class="chatbox-close" id="chatboxClose">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="chatbox-messages" id="chatboxMessages">
          <!-- Messages will be inserted here -->
        </div>

        <div class="chatbox-quick-replies" id="quickReplies">
          <button class="quick-reply-btn" data-message="Thuốc giảm đau đầu">
            💊 Thuốc giảm đau
          </button>
          <button class="quick-reply-btn" data-message="Thuốc cảm cúm">
            🤧 Thuốc cảm cúm
          </button>
          <button class="quick-reply-btn" data-message="Vitamin tăng đề kháng">
            🍊 Vitamin
          </button>
          <button class="quick-reply-btn" data-message="Thuốc tiêu hóa">
            🍵 Tiêu hóa
          </button>
          <button class="quick-reply-btn" data-message="Kiểm tra đơn hàng">
            📦 Đơn hàng
          </button>
          <button class="quick-reply-btn" data-message="Khuyến mãi hiện có">
            🎁 Khuyến mãi
          </button>
        </div>

        <div class="chatbox-input-wrapper">
          <div class="chatbox-input">
            <input 
              type="text" 
              id="chatboxInput" 
              placeholder="Nhập tin nhắn..."
              autocomplete="off"
            />
            <button class="chatbox-send" id="chatboxSend">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatboxHTML);
  }

  attachEventListeners() {
    const button = document.getElementById('chatboxButton');
    const container = document.getElementById('chatboxContainer');
    const closeBtn = document.getElementById('chatboxClose');
    const sendBtn = document.getElementById('chatboxSend');
    const input = document.getElementById('chatboxInput');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');

    button.addEventListener('click', () => this.toggleChatbox());
    closeBtn.addEventListener('click', () => this.toggleChatbox());
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    quickReplies.forEach(btn => {
      btn.addEventListener('click', () => {
        const message = btn.getAttribute('data-message');
        this.sendQuickReply(message);
      });
    });
  }

  toggleChatbox() {
    const container = document.getElementById('chatboxContainer');
    const button = document.getElementById('chatboxButton');
    const badge = document.getElementById('chatboxBadge');

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      container.classList.add('active');
      button.classList.add('hidden');
      badge.style.display = 'none';
      document.getElementById('chatboxInput').focus();
    } else {
      container.classList.remove('active');
      button.classList.remove('hidden');
    }
  }

  loadWelcomeMessage() {
    setTimeout(() => {
      this.addBotMessage(
        'Xin chào! 👋 Tôi là trợ lý tư vấn của Nhà Thuốc Online.\n\n' +
        '💊 Bạn có thể hỏi tôi về:\n' +
        '• Thuốc giảm đau, hạ sốt\n' +
        '• Thuốc cảm cúm, dị ứng\n' +
        '• Vitamin & khoáng chất\n' +
        '• Thuốc tiêu hóa, dạ dày\n' +
        '• Và nhiều loại thuốc khác...\n\n' +
        'Hoặc chọn câu hỏi nhanh bên dưới! 😊',
        true
      );
    }, 1000);
  }

  sendMessage() {
    const input = document.getElementById('chatboxInput');
    const message = input.value.trim();

    if (!message) return;

    this.addUserMessage(message);
    input.value = '';

    // Simulate bot response
    setTimeout(() => {
      this.handleBotResponse(message);
    }, 800);
  }

  sendQuickReply(message) {
    this.addUserMessage(message);
    
    setTimeout(() => {
      this.handleBotResponse(message);
    }, 800);
  }

  handleBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Kiểm tra xem có từ khóa nào khớp với danh mục không
    const matchedCategory = this.findMatchingCategory(lowerMessage);
    
    if (matchedCategory) {
      this.fetchDrugsByCategory(matchedCategory);
      return;
    }
    
    let response = '';

    if (lowerMessage.includes('thuốc') || lowerMessage.includes('tư vấn')) {
      response = 'Vui lòng cho biết triệu chứng hoặc loại thuốc bạn cần tư vấn. Tôi sẽ giúp bạn tìm sản phẩm phù hợp. 💊\n\nVí dụ: "Thuốc giảm đau đầu", "Thuốc cảm cúm", "Vitamin tăng đề kháng"\n\nLưu ý: Đối với thuốc kê đơn, bạn cần có đơn của bác sĩ.';
      this.addBotMessage(response);
    } else if (lowerMessage.includes('khuyến mãi') || lowerMessage.includes('giảm giá')) {
      this.fetchPromotions();
      return;
    } else if (lowerMessage.includes('đặt hàng') || lowerMessage.includes('mua')) {
      response = 'Để đặt hàng, bạn có thể:\n\n1️⃣ Duyệt sản phẩm trên website\n2️⃣ Thêm vào giỏ hàng\n3️⃣ Tiến hành thanh toán\n\nBạn cần hỗ trợ bước nào không? 🛒';
      this.addBotMessage(response);
    } else if (lowerMessage.includes('đơn hàng') || lowerMessage.includes('kiểm tra')) {
      // Gọi API để lấy danh sách đơn hàng
      this.fetchMyOrders();
      return;
    } else if (lowerMessage.includes('giờ') || lowerMessage.includes('mở cửa')) {
      response = '⏰ Chúng tôi phục vụ 24/7!\n\nGiao hàng:\n• Nội thành: 1-2 giờ\n• Ngoại thành: 2-4 giờ\n• Tỉnh khác: 1-3 ngày';
      this.addBotMessage(response);
    } else if (lowerMessage.includes('liên hệ') || lowerMessage.includes('hotline')) {
      response = '📞 Liên hệ với chúng tôi:\n\n• Hotline: 1900-xxxx\n• Email: support@drugstore.com\n• Địa chỉ: 123 Đường ABC, TP.HCM\n\nChúng tôi luôn sẵn sàng hỗ trợ bạn! 😊';
      this.addBotMessage(response);
    } else if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thanks')) {
      response = 'Rất vui được hỗ trợ bạn! 😊 Nếu có thắc mắc gì khác, đừng ngại liên hệ nhé!';
      this.addBotMessage(response);
    } else if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = 'Xin chào! 👋 Tôi có thể giúp gì cho bạn hôm nay?';
      this.addBotMessage(response);
    } else {
      response = 'Cảm ơn bạn đã liên hệ! Để được tư vấn tốt nhất, bạn có thể:\n\n• Cho biết triệu chứng hoặc loại thuốc cần tìm\n• Gọi hotline: 1900-xxxx\n• Email: support@drugstore.com\n\nHoặc chọn một trong các câu hỏi thường gặp bên dưới. 😊';
      this.addBotMessage(response);
    }
  }

  // Tìm category phù hợp dựa trên từ khóa
  findMatchingCategory(message) {
    let bestMatch = null;
    let longestKeywordLength = 0;

    // Tìm tất cả categories có từ khóa khớp và ưu tiên từ khóa dài nhất (cụ thể nhất)
    for (const [categoryId, config] of Object.entries(this.categoryKeywords)) {
      for (const keyword of config.keywords) {
        const lowerKeyword = keyword.toLowerCase();
        if (message.includes(lowerKeyword)) {
          // Ưu tiên từ khóa dài hơn (cụ thể hơn)
          if (lowerKeyword.length > longestKeywordLength) {
            longestKeywordLength = lowerKeyword.length;
            bestMatch = {
              id: categoryId,
              name: config.name,
              icon: config.icon
            };
          }
        }
      }
    }
    
    return bestMatch;
  }

  // Lấy danh sách thuốc theo category
  async fetchDrugsByCategory(category) {
    // Tránh gọi API nhiều lần đồng thời
    if (this.isFetching) {
      console.log('Already fetching, skipping...');
      return;
    }

    try {
      this.isFetching = true;
      
      // Hiển thị loading
      this.addBotMessage(`${category.icon} Đang tìm kiếm thuốc ${category.name} cho bạn...`);

      const response = await fetch(`${this.API_URL}/drugs?category_id=${category.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Xử lý cấu trúc response - có thể là array hoặc object {data: [...]}
      const drugs = Array.isArray(result) ? result : (result.data || []);

      if (!drugs || drugs.length === 0) {
        this.addBotMessage(
          `${category.icon} Hiện tại chúng tôi chưa có sản phẩm nào trong danh mục ${category.name}.\n\n` +
          `Bạn có thể:\n` +
          `• Xem <a href="/Web/user/pages/drugs.html">tất cả sản phẩm</a>\n` +
          `• Liên hệ hotline: 1900-xxxx để được tư vấn\n` +
          `• Thử tìm kiếm danh mục khác 😊`
        );
        return;
      }

      // Tạo message với danh sách thuốc
      let drugListHTML = `${category.icon} <strong>Danh sách thuốc ${category.name}:</strong>\n\n`;
      drugListHTML += `Tìm thấy <strong>${drugs.length}</strong> sản phẩm:\n\n`;

      // Hiển thị tối đa 5 sản phẩm đầu tiên
      const displayDrugs = drugs.slice(0, 5);
      
      displayDrugs.forEach((drug, index) => {
        const price = drug.price ? `${Number(drug.price).toLocaleString('vi-VN')}₫` : 'Liên hệ';
        const stock = drug.stock > 0 ? '✅ Còn hàng' : '❌ Hết hàng';
        drugListHTML += `\n<div class="drug-item">
          <strong>${index + 1}. ${drug.name}</strong>
          <div class="drug-details">
            💰 Giá: <span class="drug-price">${price}</span>
            ${stock}
          </div>
        </div>`;
      });

      if (drugs.length > 5) {
        drugListHTML += `\n\n<em>...và ${drugs.length - 5} sản phẩm khác</em>`;
      }

      drugListHTML += `\n\n📋 <a href="/Web/user/pages/drugs.html?category=${category.id}">Xem tất cả sản phẩm ${category.name}</a>`;
      drugListHTML += `\n\n💬 Bạn muốn biết thêm thông tin về sản phẩm nào không?`;

      this.addBotMessage(drugListHTML);

    } catch (error) {
      console.error('Error fetching drugs:', error);
      
      // Thông báo chi tiết hơn về lỗi
      let errorMessage = `Xin lỗi, hiện tại không thể tải danh sách thuốc ${category.name}.\n\n`;
      
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage += `⚠️ <strong>Server chưa được khởi động</strong>\n\n` +
          `Vui lòng:\n` +
          `1️⃣ Khởi động server: <code>cd Server && npm start</code>\n` +
          `2️⃣ Đảm bảo server chạy tại http://localhost:3000\n` +
          `3️⃣ Thử lại sau\n\n`;
      }
      
      errorMessage += `Trong thời gian chờ, bạn có thể:\n` +
        `• Xem <a href="/Web/user/pages/drugs.html">tất cả sản phẩm</a>\n` +
        `• Liên hệ hotline: <strong>1900-xxxx</strong>\n` +
        `• Email: <strong>support@drugstore.com</strong> 📧`;

      this.addBotMessage(errorMessage);
    } finally {
      // Reset flag sau khi hoàn thành
      this.isFetching = false;
    }
  }

  // Lấy danh sách khuyến mãi
  async fetchPromotions() {
    try {
      // Hiển thị loading
      this.addBotMessage('🎁 Đang tải thông tin khuyến mãi...');

      const response = await fetch(`${this.API_URL}/discounts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const discounts = await response.json();

      if (!discounts || discounts.length === 0) {
        this.addBotMessage(
          '🎁 Hiện tại chưa có chương trình khuyến mãi nào.\n\n' +
          'Vui lòng quay lại sau hoặc <a href="/Web/user/pages/promotions.html">xem trang khuyến mãi</a> để cập nhật!'
        );
        return;
      }

      // Lọc các mã còn hiệu lực
      const now = new Date();
      const activeDiscounts = discounts.filter(discount => {
        const startDate = new Date(discount.start_date);
        const endDate = new Date(discount.end_date);
        return now >= startDate && now <= endDate && discount.is_active !== false;
      });

      if (activeDiscounts.length === 0) {
        this.addBotMessage(
          '🎁 Hiện tại không có mã giảm giá đang hoạt động.\n\n' +
          'Vui lòng quay lại sau hoặc <a href="/Web/user/pages/promotions.html">xem trang khuyến mãi</a>!'
        );
        return;
      }

      // Tạo message với danh sách khuyến mãi
      let promotionHTML = '🎁 <strong>Chương trình khuyến mãi hiện có:</strong>\n\n';
      promotionHTML += `Có <strong>${activeDiscounts.length}</strong> mã giảm giá đang hoạt động:\n\n`;

      activeDiscounts.forEach((discount, index) => {
        const endDate = new Date(discount.end_date);
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        
        promotionHTML += `<div class="promotion-item">
          <div class="promotion-code">
            <strong>${index + 1}. ${discount.code}</strong>
            <span class="discount-badge">-${discount.percentage}%</span>
          </div>
          <div class="promotion-details">
            📝 ${discount.description || 'Giảm giá đặc biệt'}
          </div>
          <div class="promotion-validity">
            ⏰ Còn <strong>${daysLeft}</strong> ngày
            ${discount.usage_limit ? `• Giới hạn: ${discount.usage_limit} lượt` : ''}
          </div>
        </div>\n`;
      });

      promotionHTML += '\n💡 <strong>Cách sử dụng:</strong>\n';
      promotionHTML += '1. Thêm sản phẩm vào giỏ hàng\n';
      promotionHTML += '2. Nhập mã giảm giá khi thanh toán\n';
      promotionHTML += '3. Nhận ưu đãi ngay!\n\n';
      promotionHTML += '📋 <a href="/Web/user/pages/promotions.html">Xem chi tiết tất cả khuyến mãi</a>';

      this.addBotMessage(promotionHTML);

    } catch (error) {
      console.error('Error fetching promotions:', error);
      
      this.addBotMessage(
        '🎁 Xin lỗi, hiện tại không thể tải thông tin khuyến mãi.\n\n' +
        'Vui lòng:\n' +
        '• Xem <a href="/Web/user/pages/promotions.html">trang khuyến mãi</a>\n' +
        '• Liên hệ hotline: <strong>1900-xxxx</strong>\n' +
        '• Thử lại sau! 😊'
      );
    }
  }

  // Lấy danh sách đơn hàng của khách hàng
  async fetchMyOrders() {
    if (this.isFetching) {
      console.log('⚠️ Đang tải dữ liệu, vui lòng đợi...');
      return;
    }

    this.isFetching = true;

    try {
      // Kiểm tra user đã đăng nhập chưa
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = localStorage.getItem('token');

      if (!user || !token) {
        this.addBotMessage(
          '🔐 Bạn cần đăng nhập để xem đơn hàng.\n\n' +
          'Vui lòng <a href="/Web/user/pages/login.html">đăng nhập tại đây</a> để tiếp tục.'
        );
        return;
      }

      // Hiển thị loading message
      this.addBotMessage('⏳ Đang tải danh sách đơn hàng của bạn...');

      // Gọi API lấy đơn hàng
      const response = await fetch(`${this.API_URL}/orders/my-orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách đơn hàng');
      }

      const result = await response.json();
      const orders = Array.isArray(result) ? result : (result.data || []);

      if (!orders || orders.length === 0) {
        this.addBotMessage(
          '📦 Bạn chưa có đơn hàng nào.\n\n' +
          'Bạn có thể:\n' +
          '• Xem <a href="/Web/user/pages/drugs.html">danh sách sản phẩm</a>\n' +
          '• Liên hệ hotline: <strong>1900-xxxx</strong> để được tư vấn 😊'
        );
        return;
      }

      // Sắp xếp đơn hàng mới nhất lên đầu
      orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

      // Tạo message với danh sách đơn hàng (hiển thị 5 đơn gần nhất)
      const displayOrders = orders.slice(0, 5);
      
      let ordersHTML = `📦 <strong>Đơn hàng của bạn</strong> (${orders.length} đơn):\n\n`;

      displayOrders.forEach((order, index) => {
        const statusEmoji = {
          'Pending': '⏳',
          'Processing': '🔄',
          'Completed': '✅',
          'Cancelled': '❌'
        }[order.status] || '📋';

        const statusText = {
          'Pending': 'Chờ xử lý',
          'Processing': 'Đang xử lý',
          'Completed': 'Hoàn thành',
          'Cancelled': 'Đã hủy'
        }[order.status] || order.status;

        const orderDate = new Date(order.order_date).toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        const total = order.total_amount || order.order_items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );

        const itemCount = order.order_items?.length || 0;

        ordersHTML += `
<div class="order-item-chat" style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 14px; border-radius: 12px; margin: 10px 0; border-left: 4px solid ${order.status === 'Completed' ? '#10b981' : order.status === 'Cancelled' ? '#ef4444' : order.status === 'Processing' ? '#3b82f6' : '#f59e0b'};">
  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
    <div>
      <div style="font-weight: 700; font-size: 1rem; color: #1f2937; margin-bottom: 4px;">
        🛒 Đơn hàng #ORD-${order.order_id}
      </div>
      <div style="font-size: 0.875rem; color: #6b7280;">
        📅 ${orderDate}
      </div>
    </div>
    <div style="background: ${order.status === 'Completed' ? '#dcfce7' : order.status === 'Cancelled' ? '#fee2e2' : order.status === 'Processing' ? '#dbeafe' : '#fef3c7'}; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; color: ${order.status === 'Completed' ? '#15803d' : order.status === 'Cancelled' ? '#b91c1c' : order.status === 'Processing' ? '#1e40af' : '#92400e'};">
      ${statusEmoji} ${statusText}
    </div>
  </div>
  <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.1);">
    <div style="font-size: 0.875rem; color: #6b7280;">
      📦 ${itemCount} sản phẩm
    </div>
    <div style="font-weight: 700; font-size: 1rem; color: #ef4444;">
      ${total.toLocaleString('vi-VN')}₫
    </div>
  </div>
</div>`;
      });

      if (orders.length > 5) {
        ordersHTML += `\n<div style="text-align: center; margin-top: 12px; padding: 10px; background: #f0fdf4; border-radius: 8px; border: 1px dashed #86efac;">
          <div style="font-size: 0.875rem; color: #15803d; margin-bottom: 8px;">
            Còn <strong>${orders.length - 5}</strong> đơn hàng khác
          </div>
        </div>`;
      }

      ordersHTML += `\n\n<div style="text-align: center; margin-top: 16px;">
        <a href="/Web/user/pages/my-orders.html" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
          📋 Xem tất cả đơn hàng
        </a>
      </div>`;

      this.addBotMessage(ordersHTML);

    } catch (error) {
      console.error('❌ Lỗi khi tải đơn hàng:', error);
      
      let errorMessage = '❌ Đã xảy ra lỗi khi tải danh sách đơn hàng.\n\n';
      
      if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage += 'Phiên đăng nhập đã hết hạn. Vui lòng <a href="/Web/user/pages/login.html">đăng nhập lại</a>.';
      } else {
        errorMessage += `Lỗi: ${error.message}\n\n`;
        errorMessage += 'Vui lòng:\n' +
          '• Kiểm tra kết nối internet\n' +
          '• Thử lại sau ít phút\n' +
          '• Hoặc liên hệ hotline: <strong>1900-xxxx</strong> 📞';
      }

      this.addBotMessage(errorMessage);
    } finally {
      this.isFetching = false;
    }
  }

  addUserMessage(message) {
    const messagesContainer = document.getElementById('chatboxMessages');
    const timestamp = this.getCurrentTime();

    const messageHTML = `
      <div class="chatbox-message user-message">
        <div class="message-content">
          <p>${this.escapeHtml(message)}</p>
          <span class="message-time">${timestamp}</span>
        </div>
      </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    this.scrollToBottom();
  }

  addBotMessage(message, isWelcome = false) {
    const messagesContainer = document.getElementById('chatboxMessages');
    const timestamp = this.getCurrentTime();
    const badge = document.getElementById('chatboxBadge');

    const messageHTML = `
      <div class="chatbox-message bot-message ${isWelcome ? 'welcome-message' : ''}">
        <div class="bot-avatar">
          <i class="fas fa-user-nurse"></i>
        </div>
        <div class="message-content">
          <p>${message}</p>
          <span class="message-time">${timestamp}</span>
        </div>
      </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    this.scrollToBottom();

    // Show notification badge if chatbox is closed
    if (!this.isOpen && !isWelcome) {
      const currentBadge = parseInt(badge.textContent) || 0;
      badge.textContent = currentBadge + 1;
      badge.style.display = 'flex';
    }
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chatboxMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize chatbox when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Chatbox();
  });
} else {
  new Chatbox();
}

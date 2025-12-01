import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Cấu hình email transporter
let transporter;

if (process.env.USE_ETHEREAL === 'true') {
  // Chế độ test - sử dụng Ethereal (fake SMTP)
  // Tạo tài khoản test tự động
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  console.log('📧 Using Ethereal Email (Test mode)');
  console.log('📧 Test account:', testAccount.user);
} else {
  // Chế độ production - sử dụng Gmail
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  console.log('📧 Using Gmail:', process.env.EMAIL_USER);
}

// Template email đăng ký thành công
const registerTemplate = (user) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Chào mừng đến với Nhà Thuốc Online!</h1>
    </div>
    <div class="content">
      <p>Xin chào <strong>${user.full_name || user.username}</strong>,</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại hệ thống của chúng tôi!</p>
      <p><strong>Thông tin tài khoản:</strong></p>
      <ul>
        <li>Tên đăng nhập: <strong>${user.username}</strong></li>
        <li>Email: <strong>${user.email}</strong></li>
        <li>Vai trò: <strong>${user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</strong></li>
      </ul>
      <p>Bạn có thể đăng nhập và bắt đầu mua sắm ngay bây giờ!</p>
      <div style="text-align: center;">
        <a href="${process.env.WEB_URL || 'http://localhost:5500'}/Web/user/pages/login.html" class="button">Đăng nhập ngay</a>
      </div>
      <p>Chúc bạn có trải nghiệm mua sắm tuyệt vời!</p>
    </div>
    <div class="footer">
      <p>© 2024 Nhà Thuốc Online. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Template nâng cấp admin
const adminUpgradeTemplate = (user) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .badge { display: inline-block; padding: 5px 15px; background: #ef4444; color: white; border-radius: 20px; font-weight: bold; }
    .button { display: inline-block; padding: 12px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>👑 Chúc mừng nâng cấp Admin!</h1>
    </div>
    <div class="content">
      <p>Xin chào <strong>${user.full_name || user.username}</strong>,</p>
      <p>Tài khoản của bạn đã được nâng cấp lên quyền <span class="badge">ADMIN</span></p>
      <p><strong>Quyền hạn mới:</strong></p>
      <ul>
        <li>✅ Quản lý sản phẩm và danh mục</li>
        <li>✅ Quản lý đơn hàng</li>
        <li>✅ Quản lý người dùng</li>
        <li>✅ Xem thống kê và báo cáo</li>
        <li>✅ Quản lý mã giảm giá</li>
      </ul>
      <p>Vui lòng sử dụng quyền hạn một cách có trách nhiệm!</p>
      <div style="text-align: center;">
        <a href="${process.env.WEB_URL || 'http://localhost:5500'}/Web/admin/index.html" class="button">Truy cập trang Admin</a>
      </div>
    </div>
    <div class="footer">
      <p>© 2024 Nhà Thuốc Online. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Template đặt hàng thành công
const orderCreatedTemplate = (order, user) => {
  const itemsHTML = order.order_items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.drug_name || 'Sản phẩm'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${item.price.toLocaleString('vi-VN')}₫</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${(item.quantity * item.price).toLocaleString('vi-VN')}₫</strong></td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
    th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; }
    .total { background: #10b981; color: white; font-size: 18px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Đặt hàng thành công!</h1>
    </div>
    <div class="content">
      <p>Xin chào <strong>${user.full_name || user.username}</strong>,</p>
      <p>Cảm ơn bạn đã đặt hàng tại Nhà Thuốc Online!</p>
      
      <div class="order-info">
        <h3>Thông tin đơn hàng #${order.order_id}</h3>
        <p><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
        <p><strong>Trạng thái:</strong> <span style="color: #f59e0b;">Chờ xử lý</span></p>
        <p><strong>Phương thức thanh toán:</strong> ${order.payment_method === 'cash' ? 'Tiền mặt' : order.payment_method === 'card' ? 'Thẻ' : 'Chuyển khoản'}</p>
        ${order.notes ? `<p><strong>Ghi chú:</strong> ${order.notes}</p>` : ''}
      </div>

      <h3>Chi tiết sản phẩm:</h3>
      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th style="text-align: center;">Số lượng</th>
            <th style="text-align: right;">Đơn giá</th>
            <th style="text-align: right;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
          <tr class="total">
            <td colspan="3" style="padding: 15px; text-align: right;"><strong>Tổng cộng:</strong></td>
            <td style="padding: 15px; text-align: right;"><strong>${order.total_amount.toLocaleString('vi-VN')}₫</strong></td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 20px;">Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất!</p>
    </div>
    <div class="footer">
      <p>© 2024 Nhà Thuốc Online. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Template đơn hàng đang xử lý
const orderProcessingTemplate = (order, user) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .status-badge { display: inline-block; padding: 8px 20px; background: #3b82f6; color: white; border-radius: 20px; font-weight: bold; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Đơn hàng đang được xử lý</h1>
    </div>
    <div class="content">
      <p>Xin chào <strong>${user.full_name || user.username}</strong>,</p>
      <p>Đơn hàng <strong>#${order.order_id}</strong> của bạn đang được xử lý!</p>
      <p>Trạng thái: <span class="status-badge">Đang xử lý</span></p>
      <p><strong>Thông tin:</strong></p>
      <ul>
        <li>Mã đơn hàng: <strong>#${order.order_id}</strong></li>
        <li>Ngày đặt: ${new Date(order.createdAt).toLocaleString('vi-VN')}</li>
        <li>Tổng tiền: <strong>${order.total_amount.toLocaleString('vi-VN')}₫</strong></li>
      </ul>
      <p>Chúng tôi đang chuẩn bị hàng và sẽ giao đến bạn sớm nhất!</p>
    </div>
    <div class="footer">
      <p>© 2024 Nhà Thuốc Online. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Template đơn hàng đã hoàn thành
const orderCompletedTemplate = (order, user) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .status-badge { display: inline-block; padding: 8px 20px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; }
    .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Đơn hàng đã được giao thành công!</h1>
    </div>
    <div class="content">
      <p>Xin chào <strong>${user.full_name || user.username}</strong>,</p>
      <p>Đơn hàng <strong>#${order.order_id}</strong> đã được giao thành công đến bạn!</p>
      <p>Trạng thái: <span class="status-badge">Hoàn thành</span></p>
      <p><strong>Chi tiết:</strong></p>
      <ul>
        <li>Mã đơn hàng: <strong>#${order.order_id}</strong></li>
        <li>Ngày giao: ${new Date().toLocaleString('vi-VN')}</li>
        <li>Tổng tiền: <strong>${order.total_amount.toLocaleString('vi-VN')}₫</strong></li>
      </ul>
      <p>Cảm ơn bạn đã tin tưởng và mua sắm tại Nhà Thuốc Online!</p>
      <p>Nếu có bất kỳ vấn đề gì, vui lòng liên hệ với chúng tôi.</p>
      <div style="text-align: center;">
        <a href="${process.env.WEB_URL || 'http://localhost:5500'}/Web/user/index.html" class="button">Tiếp tục mua sắm</a>
      </div>
    </div>
    <div class="footer">
      <p>© 2024 Nhà Thuốc Online. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Hàm gửi email
const sendEmail = async (to, subject, html) => {
  try {
    if (!to) {
      console.warn('⚠️ Không có email người nhận');
      return { success: false, message: 'Không có email người nhận' };
    }

    const mailOptions = {
      from: `"Nhà Thuốc Online" <${process.env.EMAIL_USER || 'noreply@example.com'}>`,
      to: to,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    
    // Nếu dùng Ethereal, hiển thị URL xem email
    if (process.env.USE_ETHEREAL === 'true') {
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

// Export các hàm gửi email theo sự kiện
export const emailService = {
  // Gửi email đăng ký thành công
  sendRegistrationEmail: async (user) => {
    if (!user.email) return { success: false, message: 'Không có email' };
    
    const subject = '🎉 Chào mừng bạn đến với Nhà Thuốc Online!';
    const html = registerTemplate(user);
    return await sendEmail(user.email, subject, html);
  },

  // Gửi email nâng cấp admin
  sendAdminUpgradeEmail: async (user) => {
    if (!user.email) return { success: false, message: 'Không có email' };
    
    const subject = '👑 Chúc mừng! Bạn đã được nâng cấp lên Admin';
    const html = adminUpgradeTemplate(user);
    return await sendEmail(user.email, subject, html);
  },

  // Gửi email đặt hàng thành công
  sendOrderCreatedEmail: async (order, user) => {
    if (!user.email) return { success: false, message: 'Không có email' };
    
    const subject = `✅ Đơn hàng #${order.order_id} đã được đặt thành công`;
    const html = orderCreatedTemplate(order, user);
    return await sendEmail(user.email, subject, html);
  },

  // Gửi email đơn hàng đang xử lý
  sendOrderProcessingEmail: async (order, user) => {
    if (!user.email) return { success: false, message: 'Không có email' };
    
    const subject = `📦 Đơn hàng #${order.order_id} đang được xử lý`;
    const html = orderProcessingTemplate(order, user);
    return await sendEmail(user.email, subject, html);
  },

  // Gửi email đơn hàng hoàn thành
  sendOrderCompletedEmail: async (order, user) => {
    if (!user.email) return { success: false, message: 'Không có email' };
    
    const subject = `🎉 Đơn hàng #${order.order_id} đã được giao thành công`;
    const html = orderCompletedTemplate(order, user);
    return await sendEmail(user.email, subject, html);
  }
};

export default emailService;

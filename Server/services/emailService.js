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

// Template nâng cấp pharmacist
const pharmacistUpgradeTemplate = (user) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .badge { display: inline-block; padding: 5px 15px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; }
    .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    .icon { font-size: 48px; text-align: center; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💊 Chúc mừng nâng cấp Dược sĩ!</h1>
    </div>
    <div class="content">
      <div class="icon">🏥</div>
      <p>Xin chào <strong>${user.full_name || user.username}</strong>,</p>
      <p>Chúc mừng! Tài khoản của bạn đã được nâng cấp lên quyền <span class="badge">DƯỢC SĨ</span></p>
      
      <p><strong>Quyền hạn mới của bạn:</strong></p>
      <ul>
        <li>💳 Thanh toán tại quầy (POS)</li>
        <li>📦 Quản lý đơn hàng</li>
        <li>💊 Quản lý thuốc và tồn kho</li>
        <li>🖨️ In hóa đơn cho khách hàng</li>
        <li>📊 Xem thống kê doanh thu</li>
        <li>👥 Tư vấn và hỗ trợ khách hàng</li>
      </ul>
      
      <p><strong>Lưu ý quan trọng:</strong></p>
      <ul>
        <li>🔐 Bảo mật thông tin khách hàng</li>
        <li>✅ Kiểm tra kỹ đơn thuốc và toa bác sĩ</li>
        <li>📝 Ghi chép đầy đủ thông tin bán hàng</li>
        <li>⚕️ Tuân thủ quy định về dược phẩm</li>
      </ul>
      
      <p>Chúng tôi tin tưởng bạn sẽ thực hiện tốt vai trò dược sĩ và phục vụ khách hàng một cách chuyên nghiệp!</p>
      
      <div style="text-align: center;">
        <a href="${process.env.WEB_URL || 'http://localhost:5500'}/Web/pharmacist/index.html" class="button">Truy cập trang Dược sĩ</a>
      </div>
      
      <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px;">
        💡 <strong>Mẹo:</strong> Khi đăng nhập lần tiếp theo, hệ thống sẽ tự động chuyển bạn đến trang dành cho dược sĩ.
      </p>
    </div>
    <div class="footer">
      <p>© 2024 Nhà Thuốc Online. All rights reserved.</p>
      <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ admin.</p>
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
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${Number(item.price).toLocaleString('vi-VN')}₫</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${(Number(item.quantity) * Number(item.price)).toLocaleString('vi-VN')}₫</strong></td>
    </tr>
  `).join('');

  // Tính subtotal (tổng trước giảm giá) 
  const subtotal = order.order_items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
  const discountAmount = order.discount_info?.amount || 0;
  
  // Luôn tính lại để đảm bảo chính xác
  const finalTotal = subtotal - discountAmount;

  // Debug log
  console.log('📧 Email Order Created:', {
    order_id: order.order_id,
    subtotal,
    discountAmount,
    discount_code: order.discount_info?.code,
    total_from_db: order.total_amount,
    finalTotal
  });

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
    .shipping-info { background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
    th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    .discount-row { background: #fef3c7; color: #92400e; font-weight: bold; }
    .total { background: #10b981; color: white; font-size: 18px; }
    .discount-badge { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; margin: 10px 0; }
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
      
      ${order.discount_info?.code ? `
        <div style="text-align: center; margin: 20px 0;">
          <span class="discount-badge">🎁 Đã áp dụng mã giảm giá: ${order.discount_info.code} (-${order.discount_info.percentage}%)</span>
        </div>
      ` : ''}
      
      <div class="order-info">
        <h3>Thông tin đơn hàng #${order.order_id}</h3>
        <p><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
        <p><strong>Trạng thái:</strong> <span style="color: #f59e0b;">Chờ xử lý</span></p>
        <p><strong>Phương thức thanh toán:</strong> ${order.payment_method === 'cash' ? 'Tiền mặt (COD)' : order.payment_method === 'card' ? 'Thẻ tín dụng' : 'Chuyển khoản'}</p>
        ${order.notes ? `<p><strong>Ghi chú:</strong> ${order.notes}</p>` : ''}
      </div>

      <div class="shipping-info">
        <h3 style="margin-top: 0; color: #1e40af;">📍 Địa chỉ giao hàng</h3>
        <p style="margin: 5px 0;"><strong>Người nhận:</strong> ${order.shipping_address?.recipient_name || user.full_name || user.username || 'Khách hàng'}</p>
        <p style="margin: 5px 0;"><strong>Số điện thoại:</strong> ${order.shipping_address?.phone || user.phone_number || 'Chưa cập nhật'}</p>
        <p style="margin: 5px 0;"><strong>Địa chỉ:</strong> ${(() => {
          const addr = order.shipping_address;
          if (!addr || !addr.address) return 'Chưa cập nhật';
          const parts = [addr.address];
          if (addr.ward) parts.push(addr.ward);
          if (addr.district) parts.push(addr.district);
          if (addr.city) parts.push(addr.city);
          return parts.join(', ');
        })()}</p>
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
          ${discountAmount > 0 ? `
            <tr>
              <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; border-bottom: 1px solid #ddd;">Tạm tính:</td>
              <td style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd;">${subtotal.toLocaleString('vi-VN')}₫</td>
            </tr>
            <tr class="discount-row">
              <td colspan="3" style="padding: 12px; text-align: right; background: #fef3c7; color: #92400e;">
                <strong>🎁 Giảm giá (${order.discount_info.code} -${order.discount_info.percentage}%):</strong>
              </td>
              <td style="padding: 12px; text-align: right; background: #fef3c7; color: #92400e;"><strong>-${discountAmount.toLocaleString('vi-VN')}₫</strong></td>
            </tr>
          ` : ''}
          <tr class="total">
            <td colspan="3" style="padding: 15px; text-align: right;"><strong>Tổng thanh toán:</strong></td>
            <td style="padding: 15px; text-align: right;"><strong>${finalTotal.toLocaleString('vi-VN')}₫</strong></td>
          </tr>
        </tbody>
      </table>

      ${discountAmount > 0 ? `
        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
          <p style="margin: 0; color: #065f46;">
            <strong>💰 Bạn đã tiết kiệm được ${discountAmount.toLocaleString('vi-VN')}₫ với mã ${order.discount_info.code}!</strong>
          </p>
        </div>
      ` : ''}

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
const orderProcessingTemplate = (order, user) => {
  const discountAmount = order.discount_info?.amount || 0;
  const subtotal = order.order_items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
  const finalTotal = subtotal - discountAmount;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .shipping-info { background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
    .status-badge { display: inline-block; padding: 8px 20px; background: #3b82f6; color: white; border-radius: 20px; font-weight: bold; }
    .discount-badge { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; }
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
      
      ${order.discount_info?.code ? `
        <div style="text-align: center; margin: 15px 0;">
          <span class="discount-badge">🎁 Mã giảm giá: ${order.discount_info.code} (-${order.discount_info.percentage}%)</span>
        </div>
      ` : ''}
      
      <p><strong>Thông tin:</strong></p>
      <ul>
        <li>Mã đơn hàng: <strong>#${order.order_id}</strong></li>
        <li>Ngày đặt: ${new Date(order.createdAt).toLocaleString('vi-VN')}</li>
        ${discountAmount > 0 ? `
          <li>Tạm tính: ${subtotal.toLocaleString('vi-VN')}₫</li>
          <li>Tiết kiệm: <strong style="color: #10b981;">-${discountAmount.toLocaleString('vi-VN')}₫</strong></li>
        ` : ''}
        <li>Tổng tiền: <strong>${finalTotal.toLocaleString('vi-VN')}₫</strong></li>
      </ul>

      <div class="shipping-info">
        <h3 style="margin-top: 0; color: #1e40af;">📍 Địa chỉ giao hàng</h3>
        <p style="margin: 5px 0;"><strong>Người nhận:</strong> ${order.shipping_address?.recipient_name || user.full_name || user.username || 'Khách hàng'}</p>
        <p style="margin: 5px 0;"><strong>Số điện thoại:</strong> ${order.shipping_address?.phone || user.phone_number || 'Chưa cập nhật'}</p>
        <p style="margin: 5px 0;"><strong>Địa chỉ:</strong> ${(() => {
          const addr = order.shipping_address;
          if (!addr || !addr.address) return 'Chưa cập nhật';
          const parts = [addr.address];
          if (addr.ward) parts.push(addr.ward);
          if (addr.district) parts.push(addr.district);
          if (addr.city) parts.push(addr.city);
          return parts.join(', ');
        })()}</p>
      </div>
      
      <p>Chúng tôi đang chuẩn bị hàng và sẽ giao đến bạn sớm nhất!</p>
    </div>
    <div class="footer">
      <p>© 2024 Nhà Thuốc Online. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};

// Template đơn hàng đã hoàn thành
const orderCompletedTemplate = (order, user) => {
  const discountAmount = order.discount_info?.amount || 0;
  const subtotal = order.order_items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
  const finalTotal = subtotal - discountAmount;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .status-badge { display: inline-block; padding: 8px 20px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; }
    .discount-badge { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; }
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
      
      ${order.discount_info?.code ? `
        <div style="text-align: center; margin: 15px 0;">
          <span class="discount-badge">🎁 Đã sử dụng mã: ${order.discount_info.code} (-${order.discount_info.percentage}%)</span>
        </div>
      ` : ''}
      
      <p><strong>Chi tiết:</strong></p>
      <ul>
        <li>Mã đơn hàng: <strong>#${order.order_id}</strong></li>
        <li>Ngày giao: ${new Date().toLocaleString('vi-VN')}</li>
        ${discountAmount > 0 ? `
          <li>Tạm tính: ${subtotal.toLocaleString('vi-VN')}₫</li>
          <li>Đã tiết kiệm: <strong style="color: #10b981;">-${discountAmount.toLocaleString('vi-VN')}₫</strong></li>
        ` : ''}
        <li>Tổng tiền: <strong>${finalTotal.toLocaleString('vi-VN')}₫</strong></li>
      </ul>
      
      ${discountAmount > 0 ? `
        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
          <p style="margin: 0; color: #065f46;">
            <strong>🎊 Cảm ơn bạn đã sử dụng mã giảm giá ${order.discount_info.code}! Bạn đã tiết kiệm ${discountAmount.toLocaleString('vi-VN')}₫</strong>
          </p>
        </div>
      ` : ''}
      
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
};

// Template đơn hàng bị hủy
const orderCancelledTemplate = (order, user) => {
  const itemsHTML = order.order_items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.drug_name || 'Sản phẩm'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${Number(item.price).toLocaleString('vi-VN')}₫</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${(Number(item.quantity) * Number(item.price)).toLocaleString('vi-VN')}₫</strong></td>
    </tr>
  `).join('');

  // Tính subtotal (tổng trước giảm giá)
  const subtotal = order.order_items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
  const discountAmount = order.discount_info?.amount || 0;
  const finalTotal = subtotal - discountAmount;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; margin: 20px 0; }
    th { background: #fee2e2; padding: 12px; text-align: left; font-weight: bold; color: #991b1b; }
    .status-badge { display: inline-block; padding: 8px 20px; background: #ef4444; color: white; border-radius: 20px; font-weight: bold; }
    .refund-info { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>❌ Đơn hàng đã bị hủy</h1>
    </div>
    <div class="content">
      <p>Xin chào <strong>${user.full_name || user.username}</strong>,</p>
      <p>Đơn hàng <strong>#${order.order_id}</strong> của bạn đã bị hủy.</p>
      <p>Trạng thái: <span class="status-badge">Đã hủy</span></p>
      
      <div class="order-info">
        <h3>Thông tin đơn hàng #${order.order_id}</h3>
        <p><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
        <p><strong>Ngày hủy:</strong> ${new Date().toLocaleString('vi-VN')}</p>
        ${order.discount_info?.code ? `<p><strong>Mã giảm giá đã sử dụng:</strong> ${order.discount_info.code} (-${order.discount_info.percentage}%)</p>` : ''}
        ${discountAmount > 0 ? `
          <p><strong>Tạm tính:</strong> ${subtotal.toLocaleString('vi-VN')}₫</p>
          <p><strong>Giảm giá:</strong> <span style="color: #10b981;">-${discountAmount.toLocaleString('vi-VN')}₫</span></p>
        ` : ''}
        <p><strong>Tổng tiền:</strong> <strong style="color: #ef4444;">${finalTotal.toLocaleString('vi-VN')}₫</strong></p>
      </div>

      <h3>Chi tiết sản phẩm đã hủy:</h3>
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
        </tbody>
      </table>

      <div class="refund-info">
        <strong>💰 Thông tin hoàn tiền:</strong>
        <ul style="margin: 10px 0 0 0;">
          <li>Nếu bạn đã thanh toán, số tiền sẽ được hoàn lại trong <strong>3-5 ngày làm việc</strong></li>
          <li>Số lượng sản phẩm đã được hoàn trả vào kho</li>
          ${discountAmount > 0 ? `<li><strong>Mã giảm giá ${order.discount_info.code}</strong> đã được hoàn lại và có thể sử dụng cho đơn hàng tiếp theo</li>` : ''}
          <li>Bạn có thể đặt lại đơn hàng bất cứ lúc nào</li>
        </ul>
      </div>

      <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua:</p>
      <ul>
        <li>📞 Hotline: 1900-xxxx</li>
        <li>📧 Email: support@nhathuoc.com</li>
      </ul>

      <p>Cảm ơn bạn đã tin tưởng. Chúng tôi hy vọng được phục vụ bạn trong tương lai!</p>
      
      <div style="text-align: center;">
        <a href="${process.env.WEB_URL || 'http://localhost:5500'}/Web/user/pages/drugs.html" class="button">Tiếp tục mua sắm</a>
      </div>
    </div>
    <div class="footer">
      <p>© 2024 Nhà Thuốc Online. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};

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

  // Gửi email nâng cấp pharmacist
  sendPharmacistUpgradeEmail: async (user) => {
    if (!user.email) return { success: false, message: 'Không có email' };
    
    const subject = '💊 Chúc mừng! Bạn đã được nâng cấp lên Dược sĩ';
    const html = pharmacistUpgradeTemplate(user);
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
  },

  // Gửi email đơn hàng bị hủy
  sendOrderCancelledEmail: async (order, user) => {
    if (!user.email) return { success: false, message: 'Không có email' };
    
    const subject = `❌ Đơn hàng #${order.order_id} đã bị hủy`;
    const html = orderCancelledTemplate(order, user);
    return await sendEmail(user.email, subject, html);
  }
};

export default emailService;

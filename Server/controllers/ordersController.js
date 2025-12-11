import Order from "../models/ordersModel.js";
import Drug from "../models/drugModel.js";
import orderService from "../services/ordersServices.js";
import emailService from "../services/emailService.js";
import userModel from "../models/userModel.js";

// Tạo đơn hàng mới (tự tăng order_id)
export const createOrder = async (req, res) => {
  try {
    let { customer_id, order_items, payment_method, notes, status, discount_code, shipping_address } = req.body;
    if (req.user && req.user.user_id) {
      customer_id = Number(req.user.user_id);
    }

    const lastOrder = await Order.findOne().sort({ order_id: -1 });
    const newOrderId = lastOrder ? lastOrder.order_id + 1 : 1;

    let total_amount = order_items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // 🎁 Áp dụng mã giảm giá nếu có
    let discount_info = null;
    if (discount_code) {
      try {
        const Discount = (await import('../models/discountModel.js')).default;
        const discount = await Discount.findOne({ code: discount_code.toUpperCase() });
        
        if (discount && discount.is_active) {
          const now = new Date();
          if (now >= new Date(discount.start_date) && now <= new Date(discount.end_date)) {
            if (!discount.usage_limit || discount.used_count < discount.usage_limit) {
              const discountAmount = Math.round((total_amount * discount.percentage) / 100);
              total_amount -= discountAmount;
              
              discount_info = {
                code: discount.code,
                percentage: discount.percentage,
                amount: discountAmount
              };
              
              console.log(`🎁 Đơn hàng #${newOrderId} áp dụng mã ${discount.code}: -${discountAmount}₫`);
            }
          }
        }
      } catch (discountError) {
        console.error("❌ Lỗi xử lý mã giảm giá:", discountError);
      }
    }

    // CHỈ validate stock, KHÔNG giảm ở đây (để invoiceController xử lý)
    const Drug = (await import('../models/drugModel.js')).default;
    for (const item of order_items) {
      const drug = await Drug.findOne({ drug_id: item.drug_id });
      if (!drug) {
        return res.status(400).json({ success: false, message: `Không tìm thấy thuốc với drug_id ${item.drug_id}` });
      }
      
      // Validate stock dựa trên đơn vị
      const unit = item.unit || 'pill';
      let availableStock = 0;
      
      if (drug.pricing && drug.pricing[unit]) {
        availableStock = drug.pricing[unit].stock || 0;
      } else {
        // Fallback to legacy stock if pricing not available
        availableStock = drug.stock || 0;
      }
      
      if (availableStock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Thuốc ${drug.name} (${unit}) không đủ số lượng trong kho. Còn ${availableStock}, cần ${item.quantity}` 
        });
      }
      // KHÔNG giảm stock ở đây nữa
    }

    const newOrder = new Order({
      order_id: newOrderId,
      customer_id,
      order_items,
      total_amount,
      payment_method,
      notes,
      status: status && ["Pending", "Processing", "Completed", "Cancelled"].includes(status)
        ? status
        : "Pending",
      discount_info: discount_info,
      shipping_address: shipping_address || {}
    });

    await newOrder.save();

    // Debug: Log order data
    console.log('📦 Order created:', {
      order_id: newOrder.order_id,
      subtotal: order_items.reduce((sum, item) => sum + item.quantity * item.price, 0),
      discount: discount_info?.amount || 0,
      total_amount: newOrder.total_amount,
      discount_info: newOrder.discount_info
    });

    // Gửi email thông báo đặt hàng thành công
    try {
      const user = await userModel.findOne({ user_id: customer_id });
      if (user && user.email) {
        emailService.sendOrderCreatedEmail(newOrder, user).then(result => {
          if (result.success) {
            console.log('✅ Email đặt hàng đã được gửi đến:', user.email);
          } else {
            console.warn('⚠️ Không thể gửi email đặt hàng:', result.message || result.error);
          }
        });
      }
    } catch (emailError) {
      console.error('❌ Lỗi gửi email đặt hàng:', emailError);
    }

    res.status(201).json({ 
      success: true, 
      message: discount_info 
        ? `Đơn hàng đã được tạo thành công với mã giảm giá ${discount_info.code}` 
        : "Đơn hàng đã được tạo thành công",
      data: {
        order_id: newOrder.order_id,
        customer_id: newOrder.customer_id,
        order_items: newOrder.order_items,
        total_amount: newOrder.total_amount,
        payment_method: newOrder.payment_method,
        notes: newOrder.notes,
        status: newOrder.status,
        discount_info: newOrder.discount_info
      }
    });
  } catch (error) {
    console.error("❌ Lỗi tạo đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi khi tạo đơn hàng", error: error.message });
  }
};

// Lấy danh sách tất cả đơn hàng (hiện order_id)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ order_id: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách đơn hàng:", error);
    res.status(500).json({ message: "Không thể lấy danh sách đơn hàng" });
  }
};

// Lấy đơn hàng của user hiện tại
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    const orders = await Order.find({ customer_id: Number(req.user.user_id) }).sort({ order_id: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Lỗi lấy đơn hàng của tôi:", error);
    res.status(500).json({ success: false, message: "Không thể lấy danh sách đơn hàng" });
  }
};

// Lấy chi tiết đơn hàng theo order_id (không dùng ObjectId)
export const getOrderByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await Order.findOne({ order_id }).populate("customer_id", "name email phone");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Lỗi lấy chi tiết đơn hàng:", error);
    res.status(500).json({ message: "Không thể lấy chi tiết đơn hàng" });
  }
};

// Cập nhật trạng thái đơn hàng (theo order_id)
export const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Processing", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    // Lấy đơn hàng hiện tại
    const currentOrder = await Order.findOne({ order_id });
    if (!currentOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Nếu chuyển sang trạng thái Cancelled, hoàn trả stock
    if (status === "Cancelled" && currentOrder.status !== "Cancelled") {
      console.log("🔄 Hoàn trả stock cho đơn hàng bị hủy:", order_id);
      
      for (const item of currentOrder.order_items) {
        try {
          const drug = await Drug.findOne({ drug_id: item.drug_id });
          if (drug) {
            const unit = item.unit || 'pill';
            
            // Hoàn trả stock theo đơn vị
            if (drug.pricing && drug.pricing[unit]) {
              drug.pricing[unit].stock = Number(drug.pricing[unit].stock || 0) + Number(item.quantity);
            } else {
              // Fallback to legacy stock
              drug.stock = Number(drug.stock) + Number(item.quantity);
            }
            
            await drug.save();
            console.log(`✅ Hoàn trả ${item.quantity} ${drug.name} (${unit})`);
          } else {
            console.warn(`⚠️ Không tìm thấy thuốc ID ${item.drug_id}`);
          }
        } catch (error) {
          console.error(`❌ Lỗi hoàn trả stock cho drug_id ${item.drug_id}:`, error);
        }
      }
    }

    // Nếu từ Cancelled chuyển sang trạng thái khác, giảm stock lại
    if (currentOrder.status === "Cancelled" && status !== "Cancelled") {
      console.log("🔄 Giảm stock khi kích hoạt lại đơn hàng:", order_id);
      
      for (const item of currentOrder.order_items) {
        try {
          const drug = await Drug.findOne({ drug_id: item.drug_id });
          if (drug) {
            const unit = item.unit || 'pill';
            let availableStock = 0;
            
            // Kiểm tra stock theo đơn vị
            if (drug.pricing && drug.pricing[unit]) {
              availableStock = drug.pricing[unit].stock || 0;
              
              if (availableStock < item.quantity) {
                return res.status(400).json({ 
                  message: `Không đủ tồn kho cho thuốc ${drug.name} (${unit}). Còn ${availableStock}, cần ${item.quantity}` 
                });
              }
              
              drug.pricing[unit].stock = Number(availableStock) - Number(item.quantity);
            } else {
              // Fallback to legacy stock
              availableStock = drug.stock || 0;
              
              if (availableStock < item.quantity) {
                return res.status(400).json({ 
                  message: `Không đủ tồn kho cho thuốc ${drug.name}. Còn ${availableStock}, cần ${item.quantity}` 
                });
              }
              
              drug.stock = Number(drug.stock) - Number(item.quantity);
            }
            
            await drug.save();
            console.log(`✅ Giảm ${item.quantity} ${drug.name} (${unit})`);
          }
        } catch (error) {
          console.error(`❌ Lỗi giảm stock cho drug_id ${item.drug_id}:`, error);
          return res.status(500).json({ message: "Lỗi cập nhật tồn kho" });
        }
      }
    }

    // Cập nhật trạng thái
    const order = await Order.findOneAndUpdate(
      { order_id },
      { status },
      { new: true }
    );

    // Gửi email thông báo thay đổi trạng thái
    try {
      const user = await userModel.findOne({ user_id: order.customer_id });
      if (user && user.email) {
        // Gửi email theo trạng thái
        if (status === "Processing") {
          emailService.sendOrderProcessingEmail(order, user).then(result => {
            if (result.success) {
              console.log('✅ Email đang xử lý đã được gửi đến:', user.email);
            }
          });
        } else if (status === "Completed") {
          emailService.sendOrderCompletedEmail(order, user).then(result => {
            if (result.success) {
              console.log('✅ Email hoàn thành đã được gửi đến:', user.email);
            }
          });
        } else if (status === "Cancelled") {
          emailService.sendOrderCancelledEmail(order, user).then(result => {
            if (result.success) {
              console.log('✅ Email hủy đơn đã được gửi đến:', user.email);
            } else {
              console.warn('⚠️ Không thể gửi email hủy đơn:', result.message || result.error);
            }
          });
        }
      }
    } catch (emailError) {
      console.error('❌ Lỗi gửi email cập nhật đơn hàng:', emailError);
    }

    res.status(200).json({
      message: status === "Cancelled" ? "Hủy đơn hàng thành công" : "Cập nhật trạng thái thành công",
      order
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ message: "Không thể cập nhật trạng thái đơn hàng" });
  }
};

// Cập nhật toàn bộ đơn hàng (customer, items, payment, notes, status)
export const updateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { customer_id, order_items, payment_method, notes, status } = req.body;

    // Basic validation
    if (payment_method && !["cash", "card", "online"].includes(payment_method)) {
      return res.status(400).json({ message: "Phương thức thanh toán không hợp lệ" });
    }

    const items = Array.isArray(order_items) ? order_items : [];
    const total_amount = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);

    // Lấy trạng thái cũ để so sánh
    const oldOrder = await Order.findOne({ order_id });
    const oldStatus = oldOrder ? oldOrder.status : null;

    const updated = await Order.findOneAndUpdate(
      { order_id },
      {
        customer_id,
        order_items: items,
        total_amount,
        payment_method,
        notes,
        ...(status ? { status } : {}),
      },
      { new: true }
    ).populate("customer_id", "name email phone");

    if (!updated) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    // Gửi email nếu trạng thái thay đổi
    if (status && status !== oldStatus) {
      try {
        const user = await userModel.findOne({ user_id: updated.customer_id });
        if (user && user.email) {
          console.log(`📧 Trạng thái đổi từ ${oldStatus} → ${status}, gửi email...`);
          
          if (status === "Processing") {
            emailService.sendOrderProcessingEmail(updated, user).then(result => {
              if (result.success) {
                console.log('✅ Email đang xử lý đã được gửi đến:', user.email);
              } else {
                console.warn('⚠️ Không thể gửi email:', result.message || result.error);
              }
            });
          } else if (status === "Completed") {
            emailService.sendOrderCompletedEmail(updated, user).then(result => {
              if (result.success) {
                console.log('✅ Email hoàn thành đã được gửi đến:', user.email);
              } else {
                console.warn('⚠️ Không thể gửi email:', result.message || result.error);
              }
            });
          } else if (status === "Cancelled") {
            emailService.sendOrderCancelledEmail(updated, user).then(result => {
              if (result.success) {
                console.log('✅ Email hủy đơn đã được gửi đến:', user.email);
              } else {
                console.warn('⚠️ Không thể gửi email hủy đơn:', result.message || result.error);
              }
            });
          }
        } else {
          console.warn('⚠️ User không có email:', updated.customer_id);
        }
      } catch (emailError) {
        console.error('❌ Lỗi gửi email:', emailError);
      }
    }

    res.status(200).json({
      message: "✅ Cập nhật đơn hàng thành công",
      order: updated
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật đơn hàng:", error);
    res.status(500).json({ message: "Không thể cập nhật đơn hàng" });
  }
};

// Xóa đơn hàng theo order_id
export const deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await Order.findOne({ order_id });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Nếu đơn hàng chưa bị hủy, hoàn trả stock trước khi xóa
    if (order.status !== "Cancelled") {
      console.log("🔄 Hoàn trả stock trước khi xóa đơn hàng:", order_id);
      
      for (const item of order.order_items) {
        try {
          const drug = await Drug.findOne({ drug_id: item.drug_id });
          if (drug) {
            const unit = item.unit || 'pill';
            
            // Hoàn trả stock theo đơn vị
            if (drug.pricing && drug.pricing[unit]) {
              drug.pricing[unit].stock = Number(drug.pricing[unit].stock || 0) + Number(item.quantity);
            } else {
              // Fallback to legacy stock
              drug.stock = Number(drug.stock) + Number(item.quantity);
            }
            
            await drug.save();
            console.log(`✅ Hoàn trả ${item.quantity} ${drug.name} (${unit})`);
          }
        } catch (error) {
          console.error(`❌ Lỗi hoàn trả stock cho drug_id ${item.drug_id}:`, error);
        }
      }
    }

    await Order.findOneAndDelete({ order_id });

    res.status(200).json({ 
      message: "Đã xóa đơn hàng thành công"
    });
  } catch (error) {
    console.error("❌ Lỗi xóa đơn hàng:", error);
    res.status(500).json({ message: "Không thể xóa đơn hàng" });
  }
};

// Lấy top sellers theo thời gian (gọi service)
export const getTopSellers = async (req, res) => {
  try {
    const { period } = req.params; // week | month | year
    
    if (!['week', 'month', 'year'].includes(period)) {
      return res.status(400).json({ 
        success: false,
        message: "Period phải là 'week', 'month', hoặc 'year'" 
      });
    }

    const data = await orderService.getTopSellers(period);
    
    res.status(200).json({
      success: true,
      period: period,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error("❌ Lỗi thống kê top sellers:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Không thể lấy thống kê" 
    });
  }
};

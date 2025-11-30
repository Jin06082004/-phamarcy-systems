import Order from "../models/ordersModel.js";
import Drug from "../models/drugModel.js";
import User from "../models/userModel.js";
import orderService from "../services/ordersServices.js";

// Tạo đơn hàng mới (tự tăng order_id)
export const createOrder = async (req, res) => {
  try {
    let { customer_id, order_items, payment_method, notes, status } = req.body;
    // if request is authenticated, prefer token's user_id
    if (req.user && req.user.user_id) {
      customer_id = Number(req.user.user_id);
    }

    // Lấy order cuối cùng để tự tăng ID
    const lastOrder = await Order.findOne().sort({ order_id: -1 });
    const newOrderId = lastOrder ? lastOrder.order_id + 1 : 1;

    // Tính tổng tiền
    const total_amount = order_items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // Giảm số lượng tồn kho của từng thuốc
    const Drug = (await import('../models/drugModel.js')).default;
    for (const item of order_items) {
      const drug = await Drug.findOne({ drug_id: item.drug_id });
      if (!drug) {
        return res.status(400).json({ success: false, message: `Không tìm thấy thuốc với drug_id ${item.drug_id}` });
      }
      if (drug.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Thuốc ${drug.name} không đủ số lượng trong kho` });
      }
      drug.stock -= item.quantity;
      await drug.save();
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
    });

    await newOrder.save();

    res.status(201).json({ success: true, data: {
      order_id: newOrder.order_id,
      customer_id: newOrder.customer_id,
      order_items: newOrder.order_items,
      total_amount: newOrder.total_amount,
      status: newOrder.status,
      payment_method: newOrder.payment_method,
      notes: newOrder.notes,
      order_date: newOrder.order_date,
    }});
  } catch (error) {
    console.error("❌ Lỗi tạo đơn hàng:", error);
    res.status(500).json({ success: false, message: "Không thể tạo đơn hàng" });
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

    const order = await Order.findOneAndUpdate(
      { order_id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({
      message: "✅ Cập nhật trạng thái thành công",
      order,
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
    const order = await Order.findOneAndDelete({ order_id });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({ message: "✅ Đã xóa đơn hàng thành công" });
  } catch (error) {
    console.error("❌ Lỗi xóa đơn hàng:", error);
    res.status(500).json({ message: "Không thể xóa đơn hàng" });
  }
};

// Lấy top sellers theo thời gian (gọi service)
export const getTopSellers = async (req, res) => {
  try {
    const { period } = req.params; // week | month | year
    const data = await orderService.getTopSellers(period);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Lỗi thống kê top sellers:", error);
    res.status(400).json({ message: error.message });
  }
};

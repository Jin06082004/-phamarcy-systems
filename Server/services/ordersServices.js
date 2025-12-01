// services/orderService.js
import Order from "../models/ordersModel.js";
import Drug from "../models/drugModel.js";

const orderService = {
  /**
   * Lấy top thuốc bán chạy trong một khoảng thời gian
   * @param {"week" | "month" | "year"} period
   */
  async getTopSellers(period) {
    let startDate;
    const now = new Date();

    if (period === "week") {
      // Lấy ngày đầu tuần (Thứ 2)
      const day = now.getDay(); // 0 = CN, 1 = Thứ 2
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      throw new Error("Invalid period. Use 'week', 'month', or 'year'");
    }

    console.log(`📊 Thống kê top sellers từ ${startDate.toLocaleDateString('vi-VN')}`);

    // Aggregate để tính tổng số lượng bán của mỗi thuốc
    const topSellers = await Order.aggregate([
      // 1. Lọc đơn hàng từ startDate
      { 
        $match: { 
          order_date: { $gte: startDate },
          status: { $nin: ['Cancelled'] } // Không tính đơn đã hủy
        } 
      },
      
      // 2. Unwind order_items array
      { $unwind: "$order_items" },
      
      // 3. Group by drug_id và tính tổng
      {
        $group: {
          _id: "$order_items.drug_id",
          drug_name: { $first: "$order_items.drug_name" },
          quantity: { $sum: "$order_items.quantity" },
          revenue: { 
            $sum: { 
              $multiply: ["$order_items.quantity", "$order_items.price"] 
            } 
          }
        },
      },
      
      // 4. Sort theo số lượng bán giảm dần
      { $sort: { quantity: -1 } },
      
      // 5. Giới hạn top 10
      { $limit: 10 },
      
      // 6. Lookup thông tin drug từ collection drugs
      {
        $lookup: {
          from: "drugs",
          localField: "_id",
          foreignField: "drug_id",
          as: "drugInfo",
        },
      },
      
      // 7. Project kết quả
      {
        $project: {
          _id: 0,
          drug_id: "$_id",
          drug_name: "$drug_name",
          qty: "$quantity", // Alias để frontend dễ đọc
          quantity: "$quantity",
          sold: "$quantity",
          count: "$quantity",
          revenue: 1,
          image: { $arrayElemAt: ["$drugInfo.image", 0] },
          category: { $arrayElemAt: ["$drugInfo.category_id", 0] }
        },
      },
    ]);

    console.log(`✅ Tìm thấy ${topSellers.length} sản phẩm bán chạy`);
    
    return topSellers;
  }
};

export default orderService;

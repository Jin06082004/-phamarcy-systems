import invoiceModel from "../models/invoiceModel.js";
import drugModel from "../models/drugModel.js";

// Helper to compute totals from items
function computeTotals(items, invoiceLevel = {}) {
    const subtotal = items.reduce((acc, it) => acc + Number(it.total_price || it.unit_price * it.quantity), 0);
    const discount = Number(invoiceLevel.discount || 0);
    const tax = Number(invoiceLevel.tax || 0);
    const shipping_fee = Number(invoiceLevel.shipping_fee || 0);
    const total = Math.max(0, subtotal - discount + tax + shipping_fee);
    return { subtotal, discount, tax, shipping_fee, total };
}

// Create invoice: compute totals, check stock and decrement stock
export const createInvoice = async (req, res) => {
    try {
        const payload = req.body;

        if (!Array.isArray(payload.items) || payload.items.length === 0) {
            return res.status(400).json({ success: false, message: "Hóa đơn phải có ít nhất một mặt hàng" });
        }

        // 🎁 Xử lý mã giảm giá nếu có
        let appliedDiscount = null;
        let discountAmount = 0;
        
        if (payload.discount_code) {
            try {
                const Discount = (await import('../models/discountModel.js')).default;
                appliedDiscount = await Discount.findOne({ code: payload.discount_code.toUpperCase() });
                
                if (appliedDiscount) {
                    // Validate discount
                    const now = new Date();
                    if (!appliedDiscount.is_active) {
                        return res.status(400).json({ success: false, message: "Mã giảm giá đã bị vô hiệu hóa" });
                    }
                    if (now < new Date(appliedDiscount.start_date)) {
                        return res.status(400).json({ success: false, message: "Mã giảm giá chưa có hiệu lực" });
                    }
                    if (now > new Date(appliedDiscount.end_date)) {
                        return res.status(400).json({ success: false, message: "Mã giảm giá đã hết hạn" });
                    }
                    if (appliedDiscount.usage_limit && appliedDiscount.used_count >= appliedDiscount.usage_limit) {
                        return res.status(400).json({ success: false, message: "Mã giảm giá đã hết lượt sử dụng" });
                    }
                    
                    console.log(`🎁 Áp dụng mã giảm giá ${appliedDiscount.code}: ${appliedDiscount.percentage}%`);
                }
            } catch (discountError) {
                console.error("❌ Lỗi xử lý mã giảm giá:", discountError);
            }
        }

        // Validate items and check stock
        for (const it of payload.items) {
            if (!it.medicine_id || !it.quantity) {
                return res.status(400).json({ success: false, message: "Mặt hàng không hợp lệ: cần medicine_id và quantity" });
            }

            const drug = await drugModel.findOne({ drug_id: Number(it.medicine_id) });
            if (!drug) {
                return res.status(404).json({ success: false, message: `Không tìm thấy thuốc: ${it.medicine_id}` });
            }

            // Kiểm tra stock theo đơn vị
            const unit = it.unit || 'pill';
            let availableStock = 0;
            let unitPrice = 0;
            
            if (drug.pricing && drug.pricing[unit]) {
                availableStock = drug.pricing[unit].stock || 0;
                unitPrice = drug.pricing[unit].price || 0;
            } else {
                // Fallback to legacy stock
                availableStock = drug.stock || 0;
                unitPrice = drug.price || 0;
            }
            
            if (availableStock < Number(it.quantity)) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Không đủ tồn kho cho thuốc ${drug.name} (${unit}). Còn ${availableStock}, cần ${it.quantity}` 
                });
            }

            // Fill missing fields
            it.name = it.name || drug.name;
            it.unit_price = Number(it.unit_price ?? unitPrice);
            it.total_price = Number(it.total_price ?? it.unit_price * Number(it.quantity) - Number(it.discount || 0));
            it.unit = unit; // Lưu đơn vị vào item
        }

        // Compute invoice totals
        const totals = computeTotals(payload.items, payload);
        payload.subtotal = totals.subtotal;
        
        // 🎁 Tính discount amount từ mã giảm giá
        if (appliedDiscount) {
            discountAmount = Math.round((payload.subtotal * appliedDiscount.percentage) / 100);
            console.log(`🎁 Discount amount: ${discountAmount}₫ (${appliedDiscount.percentage}% của ${payload.subtotal}₫)`);
        }
        
        payload.discount = (payload.discount || 0) + discountAmount;
        payload.tax = totals.tax;
        payload.shipping_fee = totals.shipping_fee;
        payload.total = payload.subtotal - payload.discount + payload.tax + payload.shipping_fee;
        
        // Lưu thông tin mã giảm giá vào invoice
        if (appliedDiscount) {
            payload.discount_info = {
                code: appliedDiscount.code,
                percentage: appliedDiscount.percentage,
                amount: discountAmount
            };
        }

        // 🔄 Chuyển đổi guest sang customer_name và customer_phone nếu có
        if (payload.guest) {
            payload.customer_name = payload.guest.name;
            payload.customer_phone = payload.guest.phone;
        }

        console.log('📝 Tạo hóa đơn với dữ liệu:', JSON.stringify(payload, null, 2));

        const created = await invoiceModel.create(payload);

        // ✅ Giảm tồn kho sau khi tạo hóa đơn thành công
        console.log("🔄 Giảm stock cho hóa đơn:", created.invoice_id);
        for (const it of payload.items) {
            const drug = await drugModel.findOne({ drug_id: Number(it.medicine_id) });
            if (drug) {
                const unit = it.unit || 'pill';
                
                // Giảm stock theo đơn vị
                if (drug.pricing && drug.pricing[unit]) {
                    const oldStock = drug.pricing[unit].stock;
                    drug.pricing[unit].stock = Number(oldStock || 0) - Number(it.quantity);
                    await drug.save();
                    console.log(`✅ Giảm ${it.quantity} ${drug.name} (${unit}): ${oldStock} → ${drug.pricing[unit].stock}`);
                } else {
                    // Fallback to legacy stock
                    const oldStock = drug.stock;
                    drug.stock = Number(drug.stock) - Number(it.quantity);
                    await drug.save();
                    console.log(`✅ Giảm ${it.quantity} ${drug.name} (legacy): ${oldStock} → ${drug.stock}`);
                }
            }
        }

        // 🎁 Tăng used_count của mã giảm giá
        if (appliedDiscount) {
            try {
                appliedDiscount.used_count = (appliedDiscount.used_count || 0) + 1;
                await appliedDiscount.save();
                console.log(`🎁 Đã tăng used_count của mã ${appliedDiscount.code}: ${appliedDiscount.used_count}`);
                
                // Tạo redemption log
                const CouponRedemption = (await import('../models/couponRedemptionModel.js')).default;
                await CouponRedemption.create({
                    discount_id: appliedDiscount._id,
                    code: appliedDiscount.code,
                    user_id: payload.customer_id || null,
                    guest_token: payload.guest_token || "",
                    order_id: payload.order_id || null,
                    invoice_id: created.invoice_id,
                    amount: discountAmount
                });
                console.log(`📝 Đã tạo redemption log cho ${appliedDiscount.code}`);
            } catch (redeemError) {
                console.error("❌ Lỗi cập nhật mã giảm giá:", redeemError);
            }
        }

        res.status(201).json({ 
            success: true, 
            message: "Tạo hóa đơn thành công" + (appliedDiscount ? ` với mã giảm giá ${appliedDiscount.code}` : ""), 
            data: created 
        });
    } catch (error) {
        console.error("❌ Lỗi tạo hóa đơn:", error);
        res.status(500).json({ success: false, message: "Failed to create invoice", error: error.message });
    }
};

export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await invoiceModel.find().sort({ invoice_id: -1 });
    res.status(200).json({ success: true, count: invoices.length, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to get invoices", error: error.message });
    }
};

export const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const inv = await invoiceModel.findOne({ invoice_id: Number(id) });
    if (!inv) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });
    res.status(200).json({ success: true, data: inv });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to get invoice", error: error.message });
    }
};

export const getInvoiceByNumber = async (req, res) => {
    try {
        const { number } = req.params;
        const inv = await invoiceModel.findOne({ invoice_number: number });
    if (!inv) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });
    res.status(200).json({ success: true, data: inv });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to get invoice by number", error: error.message });
    }
};

export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await invoiceModel.findOneAndUpdate({ invoice_id: Number(id) }, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });
    res.status(200).json({ success: true, message: "Cập nhật hóa đơn thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update invoice", error: error.message });
    }
};

// Record a payment
export const payInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, payment_method } = req.body;
    if (!amount) return res.status(400).json({ success: false, message: "Cần phải cung cấp số tiền thanh toán" });

        const inv = await invoiceModel.findOne({ invoice_id: Number(id) });
    if (!inv) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });

        inv.paid_amount = Number(inv.paid_amount || 0) + Number(amount);
        if (payment_method) inv.payment_method = payment_method;

        if (inv.paid_amount >= inv.total) inv.status = "paid";
        else if (inv.paid_amount > 0) inv.status = "partially_paid";

    await inv.save();
    res.status(200).json({ success: true, message: "Ghi nhận thanh toán thành công", data: inv });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to record payment", error: error.message });
    }
};

// Cancel invoice - hoàn trả stock
export const cancelInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const inv = await invoiceModel.findOne({ invoice_id: Number(id) });
        
        if (!inv) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy hóa đơn" 
            });
        }

        // Chỉ hoàn trả nếu hóa đơn chưa bị hủy
        if (inv.status !== "cancelled") {
            console.log("🔄 Hoàn trả stock cho hóa đơn bị hủy:", inv.invoice_id);
            
            // Hoàn trả stock cho từng item
            for (const it of inv.items) {
                try {
                    const drug = await drugModel.findOne({ drug_id: Number(it.medicine_id) });
                    if (drug) {
                        const oldStock = drug.stock;
                        drug.stock = Number(drug.stock) + Number(it.quantity);
                        await drug.save();
                        console.log(`✅ Hoàn trả ${it.quantity} ${drug.name} (${oldStock} → ${drug.stock})`);
                    } else {
                        console.warn(`⚠️ Không tìm thấy thuốc ID ${it.medicine_id}`);
                    }
                } catch (error) {
                    console.error(`❌ Lỗi hoàn trả stock cho medicine_id ${it.medicine_id}:`, error);
                }
            }
        }

        inv.status = "cancelled";
        await inv.save();

        res.status(200).json({ 
            success: true, 
            message: "Hủy hóa đơn thành công", 
            data: inv 
        });
    } catch (error) {
        console.error("❌ Lỗi hủy hóa đơn:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to cancel invoice", 
            error: error.message 
        });
    }
};

// Delete invoice - xóa vĩnh viễn
export const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        
        let inv;
        if (/^\d+$/.test(id)) {
            inv = await invoiceModel.findOne({ invoice_id: Number(id) });
        } else {
            inv = await invoiceModel.findOne({ invoice_number: id });
        }
        
        if (!inv) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy hóa đơn" 
            });
        }

        // Nếu hóa đơn chưa bị hủy thì hoàn trả tồn kho trước khi xóa
        if (inv.status !== "cancelled") {
            console.log("🔄 Hoàn trả stock trước khi xóa hóa đơn:", inv.invoice_id);
            
            for (const it of inv.items) {
                try {
                    const drug = await drugModel.findOne({ drug_id: Number(it.medicine_id) });
                    if (drug) {
                        const oldStock = drug.stock;
                        drug.stock = Number(drug.stock) + Number(it.quantity);
                        await drug.save();
                        console.log(`✅ Hoàn trả ${it.quantity} ${drug.name} (${oldStock} → ${drug.stock})`);
                    }
                } catch (error) {
                    console.error(`❌ Lỗi hoàn trả stock:`, error);
                }
            }
        }

        // Xóa hóa đơn
        if (/^\d+$/.test(id)) {
            await invoiceModel.findOneAndDelete({ invoice_id: Number(id) });
        } else {
            await invoiceModel.findOneAndDelete({ invoice_number: id });
        }

        res.status(200).json({ 
            success: true, 
            message: "Xóa hóa đơn thành công", 
            data: inv
        });
    } catch (error) {
        console.error("❌ Lỗi xóa hóa đơn:", error);
        res.status(500).json({ 
            success: false, 
            message: "Xóa hóa đơn thất bại", 
            error: error.message 
        });
    }
};

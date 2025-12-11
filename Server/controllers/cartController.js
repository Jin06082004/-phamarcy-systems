import Cart from "../models/cartModel.js";
import userModel from "../models/userModel.js";

/**
 * POST /carts/add
 * body: { user_id?, guest_token?, guest_id?, item: { drug_id, name, price, quantity, unit?, unit_price? } }
 * OR body: { guest_id, drug_id, quantity, unit?, unit_price? }
 */
export const addToCart = async (req, res) => {
  try {
    // ✨ Hỗ trợ cả 2 format: legacy và new format
    let user_id, guest_token, item;
    
    if (req.body.item) {
      // Legacy format
      ({ user_id, guest_token, item } = req.body);
      guest_token = guest_token || req.body.guest_id;
    } else {
      // New format (direct params)
      const { guest_id, drug_id, quantity, unit, unit_price, name, price } = req.body;
      guest_token = guest_id;
      item = {
        drug_id,
        name: name || `Drug ${drug_id}`,
        price: unit_price || price || 0,
        quantity: quantity || 1,
        unit: unit || 'pill',
        unit_price: unit_price || price || 0
      };
    }
    
    if (!item || !item.drug_id || !item.quantity) {
      return res.status(400).json({ success: false, message: "Item không hợp lệ" });
    }

    const query = user_id ? { user_id: Number(user_id) } : { guest_token: String(guest_token) };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = await Cart.create({ ...query, items: [item] });
    } else {
      // ✨ Ghép item nếu đã tồn tại drug_id VÀ unit
      const idx = cart.items.findIndex(i => 
        Number(i.drug_id) === Number(item.drug_id) && 
        (i.unit || 'pill') === (item.unit || 'pill')
      );
      
      if (idx >= 0) {
        cart.items[idx].quantity = Number(cart.items[idx].quantity) + Number(item.quantity);
        cart.items[idx].price = Number(item.price || cart.items[idx].price || 0);
        cart.items[idx].unit_price = Number(item.unit_price || cart.items[idx].unit_price || item.price || 0);
      } else {
        cart.items.push(item);
      }
      await cart.save();
    }

    res.status(200).json({ success: true, message: "Đã cập nhật giỏ hàng", data: cart });
  } catch (error) {
    console.error("Cart add error:", error);
    res.status(500).json({ success: false, message: "Lỗi khi thêm vào giỏ", error: error.message });
  }
};

/**
 * GET /carts/:userOrGuest  (if numeric -> user_id, otherwise guest token)
 */
export const getCartByUserOrGuest = async (req, res) => {
  try {
    const key = req.params.key;
    let cart;
    if (/^\d+$/.test(key)) {
      cart = await Cart.findOne({ user_id: Number(key) });
    } else {
      cart = await Cart.findOne({ guest_token: key });
    }
    if (!cart) return res.status(200).json({ success: true, data: { items: [], subtotal: 0 } });
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, message: "Lỗi lấy giỏ hàng", error: error.message });
  }
};

/**
 * PUT /carts/:id/item  body: { index?, drug_id?, quantity?, price? }
 */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { index, drug_id, quantity, price } = req.body;
    const cart = await Cart.findById(id);
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    let item;
    if (typeof index === "number") {
      item = cart.items[index];
    } else if (drug_id) {
      item = cart.items.find(i => Number(i.drug_id) === Number(drug_id));
    }

    if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

    if (quantity !== undefined) item.quantity = Number(quantity);
    if (price !== undefined) item.price = Number(price);

    await cart.save();
    res.status(200).json({ success: true, message: "Cập nhật item thành công", data: cart });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ success: false, message: "Lỗi cập nhật item", error: error.message });
  }
};

/**
 * DELETE /carts/:id/item  body: { index? , drug_id? }
 */
export const removeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { index, drug_id } = req.body;
    const cart = await Cart.findById(id);
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    if (typeof index === "number") {
      cart.items.splice(index, 1);
    } else if (drug_id) {
      cart.items = cart.items.filter(i => Number(i.drug_id) !== Number(drug_id));
    } else {
      return res.status(400).json({ success: false, message: "Cần index hoặc drug_id để xóa" });
    }

    await cart.save();
    res.status(200).json({ success: true, message: "Xóa item thành công", data: cart });
  } catch (error) {
    console.error("Remove cart item error:", error);
    res.status(500).json({ success: false, message: "Lỗi xóa item", error: error.message });
  }
};

/**
 * DELETE /carts/clear/:id
 */
export const clearCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findByIdAndDelete(id);
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
    res.status(200).json({ success: true, message: "Đã xóa giỏ hàng", data: cart });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ success: false, message: "Lỗi xóa giỏ hàng", error: error.message });
  }
};

/**
 * POST /carts/merge
 * body: { guest_token, user_id } - merge guest cart into user cart (useful after login)
 */
export const mergeGuestCart = async (req, res) => {
  try {
    const { guest_token } = req.body;
    // if authenticated, prefer token's user_id
    const user_id = (req.user && req.user.user_id) ? Number(req.user.user_id) : req.body.user_id;
    if (!guest_token || !user_id) return res.status(400).json({ success: false, message: "guest_token và user_id required" });

    const guestCart = await Cart.findOne({ guest_token });
    if (!guestCart) return res.status(200).json({ success: true, message: "No guest cart to merge" });

    let userCart = await Cart.findOne({ user_id: Number(user_id) });
    if (!userCart) {
      userCart = await Cart.create({ user_id: Number(user_id), items: guestCart.items });
    } else {
      // merge items
      for (const it of guestCart.items) {
        const idx = userCart.items.findIndex(i => Number(i.drug_id) === Number(it.drug_id));
        if (idx >= 0) {
          userCart.items[idx].quantity += it.quantity;
        } else {
          userCart.items.push(it);
        }
      }
      await userCart.save();
    }

    await Cart.findByIdAndDelete(guestCart._id);
    res.status(200).json({ success: true, message: "Merge thành công", data: userCart });
  } catch (error) {
    console.error("Merge cart error:", error);
    res.status(500).json({ success: false, message: "Lỗi merge giỏ hàng", error: error.message });
  }
};
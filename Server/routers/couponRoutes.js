import { Router } from "express";
import { redeemCoupon, getActivePromotions } from "../controllers/couponController.js";

const router = Router();

// Get active promotions (short-term or expiring soon)
router.get("/active-promotions", getActivePromotions);

// Redeem a coupon
router.post("/redeem", redeemCoupon);

export default router;
import { Router } from "express";
import { redeemCoupon } from "../controllers/couponController.js";

const router = Router();

// Redeem a coupon
router.post("/redeem", redeemCoupon);

export default router;
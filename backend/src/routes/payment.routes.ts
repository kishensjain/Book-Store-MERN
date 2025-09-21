import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createPaymentOrder, verifyPayment } from "../controllers/payment.controller.js"

const router = express.Router();

router.post("/create", authMiddleware, createPaymentOrder);
router.post("/verify", authMiddleware, verifyPayment);

// Webhook route (⚠️ no auth middleware here, Razorpay needs direct access)
// router.post("/webhook", express.json({ type: "application/json" }), razorpayWebhook);

export default router;

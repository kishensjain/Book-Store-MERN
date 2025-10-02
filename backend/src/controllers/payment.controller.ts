import {Request, Response} from "express";
// import {razorpay} from "../config/razorpay.js";
import {razorpay} from "../config/razorpay.mock.js";
import Order from "../models/order.model.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";

export const createPaymentOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Create Razorpay order
    const options = {
        amount: order.totalAmount * 100, // amount in paise
        currency: "INR",
        receipt: `order_rcptid_${order._id}`,
        notes: {
        orderId: order.id // 👈 so we can track it in webhook
        },
    };


    const razorpayOrder = await razorpay.orders.create(options);
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID, // frontend needs this
    });
  } catch (error) {
    console.error("Error in createPaymentOrder:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// export const verifyPayment = async (req: Request, res: Response) => {

//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ message: "Missing payment details" });
//     }

//     // Step 1: Verify Razorpay signature
//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
//       .update(sign)
//       .digest("hex");

//     if (expectedSign !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid signature" });
//     }

//     // Step 2: Find our order from razorpay_order_id
//     const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Step 3: Mark payment as completed
//     order.paymentStatus = "completed";
//     await order.save();

//     return res.status(200).json({ success: true, message: "Payment verified", order });
//   } catch (error) {
//     console.error("Error in verifyPayment:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


// Razorpay Webhook Handler
// export const razorpayWebhook = async (req: Request, res: Response) => {
//   try {
//     const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

//     // Razorpay sends a signature in headers
//     const signature = req.headers["x-razorpay-signature"] as string;

//     // Verify signature using payload + secret
//     const shasum = crypto.createHmac("sha256", secret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if (digest !== signature) {
//       return res.status(400).json({ message: "Invalid webhook signature" });
//     }

//     const event = req.body.event;

//     // ✅ Example: Payment captured
//     if (event === "payment.captured") {
//       const payment = req.body.payload.payment.entity;

//       // Update order payment status
//       await Order.findOneAndUpdate(
//         { _id: payment.notes.orderId }, // you can pass orderId in Razorpay order "notes"
//         { paymentStatus: "completed" },
//         { new: true }
//       );
//     }

//     // Handle failed payments
//     if (event === "payment.failed") {
//       const payment = req.body.payload.payment.entity;

//       await Order.findOneAndUpdate(
//         { _id: payment.notes.orderId },
//         { paymentStatus: "failed" },
//         { new: true }
//       );
//     }

//     return res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Error in Razorpay webhook:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Fake verification ✅
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "completed"; // Simulate successful payment
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified (mock)",
      order
    });
  } catch (error) {
    console.error("Error in verifyPayment (mock):", error);
    return res.status(500).json({ message: "Server error" });
  }
}
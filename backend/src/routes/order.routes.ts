import express from 'express';

const router = express.Router();

import {createOrder,getAllOrders, getUserOrders,getOrderById,updateOrderStatus,updatePaymentStatus,cancelOrder} from '../controllers/order.controller.js';

import { adminRoute, authMiddleware } from '../middlewares/auth.middleware.js';

router.post('/', authMiddleware, createOrder);

// Admin only
router.get('/', authMiddleware, adminRoute, getAllOrders);

// Users can see their own orders
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/:orderId', authMiddleware, getOrderById);

// Admin can update status
router.put('/:orderId/status', authMiddleware, adminRoute, updateOrderStatus);

// Payment updates → handled by Razorpay or admin
router.put('/:orderId/payment', authMiddleware, adminRoute, updatePaymentStatus);

// Cancel → user or admin
router.put('/:orderId/cancel', authMiddleware, cancelOrder);


export default router;
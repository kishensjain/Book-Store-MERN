import express from 'express';

const router = express.Router();

import {createOrder,getAllOrders, getUserOrders,getOrderById,updateOrderStatus,updatePaymentStatus,cancelOrder} from '../controllers/order.controller.js';

import { adminRoute, authMiddleware } from '../middlewares/auth.middleware.js';

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware,adminRoute, getAllOrders);
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/:orderId', authMiddleware,adminRoute, getOrderById);
router.put('/:orderId/status', authMiddleware,adminRoute, updateOrderStatus);
router.put('/:orderId/payment', authMiddleware, updatePaymentStatus);
router.put('/:orderId/cancel', authMiddleware, cancelOrder);

export default router;
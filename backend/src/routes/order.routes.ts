import express from 'express';

const router = express.Router();

import {createOrder,getAllOrders, getUserOrders,getOrderById,updateOrderStatus,updatePaymentStatus,cancelOrder} from '../controllers/order.controller.js';

import { adminRoute, authMiddleware } from '../middlewares/auth.middleware.js';

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getAllOrders);
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware,adminRoute, getOrderById);
router.put('/:id/status', authMiddleware,adminRoute, updateOrderStatus);
router.put('/:id/payment', authMiddleware, updatePaymentStatus);
router.put('/:id/cancel', authMiddleware, cancelOrder);

export default router;
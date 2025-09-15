import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';

import { 
  addToCart, 
  getCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart 
} from '../controllers/cart.controller.js';

const router = express.Router();

router.post("/", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.put("/:bookId", authMiddleware, updateCartItem);
router.delete("/:bookId", authMiddleware, removeCartItem);
router.delete("/", authMiddleware, clearCart);

export default router;
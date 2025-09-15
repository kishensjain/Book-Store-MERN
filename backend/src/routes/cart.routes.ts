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

router.post("/addToCart", authMiddleware, addToCart);
router.get("/getCart/:id", authMiddleware, getCart);
router.put("/updateCartItem/:bookId", authMiddleware, updateCartItem);
router.delete("/removeCartItem", authMiddleware, removeCartItem);
router.delete("/clearCart", authMiddleware, clearCart);

export default router;
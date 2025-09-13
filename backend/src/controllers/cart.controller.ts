import { Request, Response } from "express";
import Cart from "../models/cart.model.js";
import Book from "../models/book.model.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id; //comes from auth middleware
    const { bookId, quantity } = req.body;

    if (!bookId || !quantity) {
      return res
        .status(400)
        .json({ message: "BookId and quantity are required" });
    }

    //Find or create cart
    //Validate book exists and has sufficient stock
    //If book already in cart, update quantity and price
    //Else add new item to cart
    //Recalculate total amount
    //Save cart and return updated cart

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalAmount: 0 });
    }
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const existingItem = cart.items.find(
      (item) => item.book.toString() === bookId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = book.price;
    } else {
      cart.items.push({
        book: book._id,
        quantity,
        price: book.price,
      });
    }

    await cart.save();

    const populatedCart = await cart.populate(
      "items.book",
      "title author price stock"
    );
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCart = async (req: Request, res: Response) => {};

export const updateCartItem = async (req: Request, res: Response) => {};

export const removeCartItem = async (req: Request, res: Response) => {};

export const clearCart = async (req: Request, res: Response) => {};

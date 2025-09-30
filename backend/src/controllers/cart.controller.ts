import { Request, Response } from "express";
import Cart, { ICart } from "../models/cart.model.js";
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

    const existingItem = cart.items.find((item) => item.book.toString() === bookId);
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

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart : ICart | null = await Cart.findOne({user:req.user?._id})
      .populate("items.book", "title author price stock") ;
    if (!cart) {
      return res.status(200).json({ items:[],totalAmount:0});
    }
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error in getCart:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const {bookId} = req.params;
    const {quantity} = req.body;

    if(!bookId || quantity === undefined){
      return res.status(400).json({message:"bookId and quantity are required"});
    }
    //Validate book exists and has sufficient stock
    //Find user's cart
    //Find item in cart
    //If quantity is 0, remove item
    //Else update quantity and price
    //Recalculate total amount
    //Save cart and return updated cart

    const book = await Book.findById(bookId);
    if(!book){
      return res.status(404).json({message:"Book not found"});
    }
    if(book.stock < quantity && quantity > 0){
      return res.status(400).json({message:"Insufficient stock"});
    }

    const cart = await Cart.findOne({user:req.user?._id});
    if(!cart){
      return res.status(404).json({message:"Cart not found"});
    }

    const itemIndex = cart.items.findIndex(item => item.book.equals(bookId));
    if(itemIndex === -1){
      return res.status(404).json({message:"Item not found in cart"});
    }
    
    if(quantity === 0){
      cart.items.splice(itemIndex,1);
    }else{
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = book.price;
    }

    await cart.save();
    const populatedCart = await cart.populate("items.book","title author price stock");
    return res.status(200).json(populatedCart);
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id; //comes from auth middleware
  const { bookId } = req.params;

  if (!bookId) {
    return res.status(400).json({ message: "bookId is required" });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.book.equals(bookId));
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const populatedCart = await cart.populate("items.book", "title author price stock");
    return res.status(200).json(populatedCart);
  } catch (error) {
    console.error("Error in removeCartItem:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const  clearCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id; //comes from auth middleware

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items.splice(0, cart.items.length);
    cart.totalAmount = 0;
    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error in clearCart:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Book from "../models/book.model.js";
import User from "../models/user.model.js";

// 1. Create Order (checkout)
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.book");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate stock
    for (const item of cart.items) {
      if (!item.book) continue;
      if ((item.book as any).stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${ (item.book as any).title }` });
      }
    }

    // Create new order
    const order = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        book: item.book._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cart.totalAmount,
      shippingAddress,
      status: "pending",
      paymentStatus: "pending",
    });

    await order.save();

    // Deduct stock
    const bulkOps = cart.items.map(item => ({
        updateOne: {
        filter: { _id: item.book._id },
        update: { $inc: { stock: -item.quantity } }
    }
    }));

    // Execute all at once
    await Book.bulkWrite(bulkOps);


    // Clear cart
    cart.items.splice(0, cart.items.length); // clears the array
    cart.totalAmount = 0;
    await cart.save();

    const populatedOrder = await order.populate(
      "items.book",
      "title author price"
    );

    // Send order confirmation email
    const user = await User.findById(userId);
    

    return res.status(201).json(populatedOrder);
  } catch (error) {
    console.error("Error in createOrder:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// 2. Get All Orders (admin only)
export const getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find().populate("user","name email").populate("items.book","title author price");

        if(orders.length === 0) return res.status(200).json([]);
        return res.status(200).json(orders);
    } catch (error) {
        console.log("Error in getAllOrders:", error);
        return res.status(500).json({message:"Server error"});
    }
};

// 3. Get User Orders (my orders)
export const getUserOrders = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    try {
       const orders = await Order.find({user:userId}).populate("items.book","title author price"); 
        if(orders.length === 0) return res.status(200).json([]);
        return res.status(200).json(orders);
    } catch (error) {
        console.log("Error in getUserOrders:", error);
        return res.status(500).json({message:"Server error"});
    }
};

// 4. Get Order By ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
    const {orderId} = req.params;
    const userId = req.user?._id;

    try {
        const order = await Order.findById(orderId).populate("items.book","title author price").populate("user","name email");
        if(!order) return res.status(404).json({message:"Order not found"});
        
        // If the user is not admin, ensure they can only access their own orders
        if(req.user?.role !== "admin" && order.user._id.toString() !== userId?.toString()){
            return res.status(403).json({message:"Forbidden"});
        }
        return res.status(200).json(order);
    } catch (error) {
        console.log("Error in getOrderById:", error);
        return res.status(500).json({message:"Server error"});
    }
};

// 5. Update Order Status (admin only)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Only admins can update order status" });
    }

    const {orderId} = req.params;
    const {status} = req.body;
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    
    if(!validStatuses.includes(status)){
        return res.status(400).json({message:"Invalid status"});
    }
    try {
        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({message:"Order not found"});
        order.status = status;
        await order.save();
        const updatedOrder = await order.populate("items.book", "title author price");
        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.log("Error in updateOrderStatus:", error);
        return res.status(500).json({message:"Server error"});
    }
};

// 6. Update Payment Status
export const updatePaymentStatus = async (req: AuthRequest,res: Response) => {
    if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Only admins can update order status" });
    }
    const {orderId} = req.params;
    const {paymentStatus} = req.body;
    const validPaymentStatuses = ["pending", "completed", "failed"];
    
    if(!validPaymentStatuses.includes(paymentStatus)){
        return res.status(400).json({message:"Invalid payment status"});
    }
    try {
        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({message:"Order not found"});
        order.paymentStatus = paymentStatus;
        await order.save();
        const updatedOrder = await order.populate("items.book", "title author price");
        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.log("Error in updatePaymentStatus:", error);
        return res.status(500).json({message:"Server error"});
    }
};

// 7. Cancel Order (user)
export const cancelOrder = async (req: AuthRequest, res: Response) => {
    const {orderId} = req.params;
    const userId = req.user?._id;
    
    try {
        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({message:"Order not found"});
        
        // Ensure the user can only cancel their own orders or if they are admin    
        if (req.user?.role !== "admin" && order.user.toString() !== userId?.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (!["pending", "processing"].includes(order.status)) {
            return res.status(400).json({ message: `Cannot cancel order once it is ${order.status}` });
        }

        if(order.status === "cancelled"){
            return res.status(400).json({message:"Order is already cancelled"});
        }

        if (order.paymentStatus === "completed") {
            return res.status(400).json({ message: "Cannot cancel a paid order. Please request a refund." });
        }


        order.status = "cancelled";
        await order.save();

        // Restock the books
        const bulkOps = order.items.map(item => ({
            updateOne:{
                filter:{_id:item.book}, //find the book
                update:{$inc:{stock:item.quantity}} //increment the stock
            }
        }))
        await Book.bulkWrite(bulkOps); //update all at once

        const updatedOrder = await order.populate("items.book", "title author price");
        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.log("Error in cancelOrder:", error);
        return res.status(500).json({message:"Server error"});
    }
};
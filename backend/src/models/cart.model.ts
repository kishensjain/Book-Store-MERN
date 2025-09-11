import mongoose from "mongoose";

export interface ICartItem {
    book: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export interface ICart extends mongoose.Document{
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
    totalAmount: number;
}

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 }, { unique: true });// Ensure one cart per user

cartSchema.pre<ICart>(/^find/, function (next) {
    this.populate("items.book","title author price stock");
    next();
});

cartSchema.pre<ICart>("save", function (next) {
    this.totalAmount = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    next();
})

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;

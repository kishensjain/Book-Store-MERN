import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  bookId: string | null;
  title: string | null;
  price: number;
  coverImage: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(
        (item) => item.bookId === action.payload.bookId
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        if (existingItem.quantity < 1) existingItem.quantity = 1;
      } else {
  state.items.push({
    ...action.payload,
    quantity: Math.max(action.payload.quantity, 1), // ensure at least 1
  });
}
    },

    removeFromCart(state, action :PayloadAction<string>) {
      const bookId = action.payload
      const existingItem = state.items.find(
        (item) => item.bookId === bookId
      );
      if (existingItem) {
        state.items = state.items.filter(
          (cartItem) => cartItem.bookId !== bookId
        );
      }
    },

    updateCart(state, action: PayloadAction<CartItem>) {
      let existingItem = state.items.find(
        (item) => item.bookId === action.payload.bookId
      );
      if (existingItem) {
        Object.assign(existingItem, action.payload)
        if (existingItem.quantity < 1) existingItem.quantity = 1;
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {addToCart, removeFromCart, updateCart, clearCart} = slice.actions
export default slice.reducer
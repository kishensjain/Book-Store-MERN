import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { act, Activity } from "react";

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
      } else {
        state.items.push(action.payload);
      }
    },

    removeFromCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(
        (item) => item.bookId === action.payload.bookId
      );
      if (existingItem) {
        state.items = state.items.filter(
          (cartItem) => cartItem.bookId !== action.payload.bookId
        );
      }
    },

    updateCart(state, action: PayloadAction<CartItem>) {
      let existingItem = state.items.find(
        (item) => item.bookId === action.payload.bookId
      );
      if (existingItem) {
        Object.assign(existingItem, action.payload)
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {addToCart, removeFromCart, updateCart, clearCart} = slice.actions
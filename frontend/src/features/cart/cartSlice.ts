import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

export interface CartItem {
  _id?: string;
  bookId: string;
  title: string;
  price: number;
  coverImage: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const saveCart = (state: CartState) => {
  localStorage.setItem("cart", JSON.stringify(state.items));
};

const savedCart = localStorage.getItem("cart");
const initialState: CartState = {
  items: savedCart ? JSON.parse(savedCart) : [],
  loading: false,
  error: null,
};

//async thunks
// 1️⃣ Fetch user cart from backend
export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  { rejectValue: string }
>("cart/fetchCart", async (_, thunkApi) => {
  try {
    const response = await api.get("/cart");
    return response.data.items || []; // array of items
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error.response?.data?.message || "Failed to fetch cart"
    );
  }
});

// 2️⃣ Add or update item in backend cart
export const addItemToCartBackend = createAsyncThunk<
  CartItem,
  CartItem,
  { rejectValue: string }
>("cart/addItemToCartBackend", async (bookDetails, thunkApi) => {
  console.log("🟢 Sending request to backend with:", bookDetails);
  try {
    const response = await api.post("/cart", {
      bookId: bookDetails.bookId,
      quantity: bookDetails.quantity,
    });
    console.log("🟢 Backend response:", response.data);

    return response.data;
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error.response?.data?.message || "Failed to add item"
    );
  }
});

// 3️⃣ Remove item from backend
export const removeItemFromCartBackend = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("cart/removeItemFromCartBackend", async (bookId, thunkApi) => {
  try {
    await api.delete(`/cart/${bookId}`);
    return bookId;
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error.response?.data?.message || "Failed to remove item"
    );
  }
});

// 4️⃣ Clear entire backend cart
export const clearCartBackend = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("cart/clearCartBackend", async (_, thunkApi) => {
  try {
    await api.delete("/cart");
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error.response?.data?.message || "Failed to clear cart"
    );
  }
});

export const syncCart = createAsyncThunk<void, void, { rejectValue: string }>(
  "cart/syncCart",
  async (_, thunkApi) => {
    try {
      const state: any = thunkApi.getState();
      const localCart: CartItem[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      // If user is logged in, merge local items with backend
      if (localCart.length > 0) {
        await Promise.all(localCart.map((item) => api.post("/cart", item)));
        // ✅ Clear local storage once synced
        localStorage.removeItem("cart");
      }

      // ✅ Fetch the merged cart from backend (your getCart response)
      const response = await api.get("/cart");
      const { items } = response.data;

      // ✅ Update redux store directly
      thunkApi.dispatch(
        fetchCart.fulfilled(items, "cart/fetchCart", undefined)
      );
    } catch (error: any) {
      console.error("Error syncing cart:", error);
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to sync cart"
      );
    }
  }
);

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
      saveCart(state);
    },

    removeFromCart(state, action: PayloadAction<string>) {
      const bookId = action.payload;
      const existingItem = state.items.find((item) => item.bookId === bookId);
      if (existingItem) {
        state.items = state.items.filter(
          (cartItem) => cartItem.bookId !== bookId
        );
      }
      saveCart(state);
    },

    updateCart(state, action: PayloadAction<CartItem>) {
      let existingItem = state.items.find(
        (item) => item.bookId === action.payload.bookId
      );
      if (existingItem) {
        Object.assign(existingItem, action.payload);
        if (existingItem.quantity < 1) existingItem.quantity = 1;
      }
      saveCart(state);
    },

    clearCart(state) {
      state.items = [];
      saveCart(state);
    },
  },

  extraReducers: (builder) => {
    builder
      // 🌀 Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        const cartData = action.payload as any;
        if (Array.isArray(cartData)) {
          // Direct array (local fallback)
          state.items = cartData;
        } else if (cartData.items) {
          // Backend response shape
          state.items = cartData.items.map((item: any) => ({
            bookId: item.book._id,
            title: item.book.title,
            price: item.book.price,
            coverImage: item.book.coverImage?.url || "",
            quantity: item.quantity,
          }));  
        } else {
          state.items = [];
        }

        state.error = null;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      // ➕ Add item
      .addCase(addItemToCartBackend.fulfilled, (state, action) => {
        const existing = state.items.find(
          (i) => i.bookId === action.payload.bookId
        );
        if (existing) {
          existing.quantity += action.payload.quantity;
          saveCart(state);
        } else {
          state.items.push(action.payload);
        }
      })

      // ❌ Remove item
      .addCase(removeItemFromCartBackend.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.bookId !== action.payload);
        saveCart(state);
      })

      // 🧹 Clear cart
      .addCase(clearCartBackend.fulfilled, (state) => {
        state.items = [];
        saveCart(state);
      });
  },
});

export const { addToCart, removeFromCart, updateCart, clearCart } =
  slice.actions;
export default slice.reducer;

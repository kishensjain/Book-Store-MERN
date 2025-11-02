import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";
import { syncCart } from "../cart/cartSlice";

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string; // optional, since frontend may ignore
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

// Load saved state from localStorage
let parsedUser: User | null = null;
try {
  const savedUser = localStorage.getItem("user");
  if (savedUser && savedUser !== "undefined") parsedUser = JSON.parse(savedUser);
} catch (err) {
  console.warn("Failed to parse user from localStorage", err);
}

const initialState: AuthState = {
  user: parsedUser,
  accessToken: localStorage.getItem("accessToken") || null,
  loading: false,
  error: null,
};

// Async Thunks

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, thunkApi) => {
  try {
    const response = await api.post("/auth/login", credentials);

    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("accessToken", response.data.accessToken);
    
    thunkApi.dispatch(syncCart())
    return response.data;
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error.response?.data?.message || "Login Failed"
    );
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterCredentials,
  { rejectValue: string }
>("auth/registerUser", async (credentials, thunkApi) => {
  try {
    const response = await api.post("/auth/register", credentials);

    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("accessToken", response.data.accessToken);

    return response.data;
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error.response?.data?.message || "Registration Failed"
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, thunkApi) => {
    try {
      await api.post("/auth/logout");

      thunkApi.dispatch(logout());
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("cart")
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Logout Failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------- Login --------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Login Failed";
      })

      // -------- Register --------
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Registration Failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

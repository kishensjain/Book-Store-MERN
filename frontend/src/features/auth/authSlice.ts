import {createAsyncThunk,createSlice,type PayloadAction} from "@reduxjs/toolkit";
import api from "../../api/axios";

interface AuthState {
  user: null | {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean; // for async API calls
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }, thunkApi) => {
    try {
      const response = await api.post("auth/login", credentials);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Login Failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    credentials: { name: string; email: string; password: string },
    thunkApi
  ) => {
    try {
      const response = await api.post("auth/register", credentials);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Registration Failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkApi) => {
    try {
      await api.post("auth/logout");
      thunkApi.dispatch(logout());
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Logout Failed"
      );
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action : PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export const { logout } = slice.actions;
export default slice.reducer;

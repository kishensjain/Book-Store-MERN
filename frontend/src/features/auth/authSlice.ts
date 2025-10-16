import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean; // for async API calls
  error: string | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  AuthResponse, // ✅ return type
  LoginCredentials, // ✅ argument type
  { rejectValue: string } // ✅ rejection type
>(
  "auth/loginUser",
  async (credentials: LoginCredentials, thunkApi) => {
    try {
      const response = await api.post("auth/login", credentials);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Login Failed"
      );

      //If you just throw new Error(), action.payload will be undefined and the error is in action.error.

      //Using rejectWithValue + rejectValue type ensures your reducer can safely read the payload without type assertions.
    }
  }
);

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterCredentials,
  { rejectValue: string }
>(
  "auth/registerUser",
  async (
    credentials: RegisterCredentials,
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

export const logoutUser = createAsyncThunk<void, void, {rejectValue : string}>(
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
      state.error = null;
      state.loading = false;
    },
  },

  //extraReducers is where your thunks connect to the slice state
  extraReducers: (builder) => {
    //builder is an object provided by Redux Toolkit to add reducers for actions generated outside of your slice (like async thunks).
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        // console.log("Payload from backend:", action.payload);
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAdmin: action.payload.isAdmin,
  };
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAdmin: action.payload.isAdmin,
  };
        state.accessToken = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false,
        state.error = action.payload ?? null
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;

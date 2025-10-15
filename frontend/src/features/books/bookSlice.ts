import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  coverImage?: { url: string; public_id: string };
}

interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk<Book[], void, {rejectValue :string}>(
  "books/fetchBooks",
  async (_, thunkApi) => {
    try {
      const response = await api.get("/books");
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to fetch books"
      );
    }
  }
);

export const fetchBookById = createAsyncThunk<Book, string, {rejectValue:string}>(
  "books/getchBookById",
  async (id : string, thunkApi) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error :any) {
      return thunkApi.rejectWithValue(
        error.response?.data.message || "Failed to fetch required book"
      )
    }
  }
)

const slice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.loading = false; 
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default slice.reducer;

import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { RootState } from "../../app/store";
interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  description:string,
  coverImage?: { url: string; public_id: string };
}

interface BooksState {
  books: Book[];
  selectedBook: Book | null;
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  selectedBook: null,
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk<
  Book[],//return type
  void,// argument type
  { rejectValue: string } //rejection type
>("books/fetchBooks", async (_, thunkApi) => {
  try {
    const response = await api.get("/books");
    return response.data;
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error.response?.data?.message || "Failed to fetch books"
    );
  }
});

export const fetchBookById = createAsyncThunk<
  Book,
  string,
  { rejectValue: string }
>("books/getchBookById", async (id: string, thunkApi) => {
  try {
    const response = await api.get(`/books/${id}`);
    return response.data;
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error.response?.data.message || "Failed to fetch required book"
    );
  }
});

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
      })
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedBook = null; // reset previous book
      })
      .addCase(
        fetchBookById.fulfilled,
        (state, action: PayloadAction<Book>) => {
          state.loading = false;
          state.selectedBook = action.payload;
        }
      )
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch book";
      });
  },
});

export default slice.reducer;
export const selectSelectedBook = (state: RootState) => state.books.selectedBook;

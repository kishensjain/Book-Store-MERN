import { createSlice } from "@reduxjs/toolkit";

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


const slice = createSlice({
    name: "book",
    initialState,
    reducers:{}
})

export default slice.reducer
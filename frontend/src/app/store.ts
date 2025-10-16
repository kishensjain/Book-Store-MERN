import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import authReducer from "../features/auth/authSlice"
import booksReducer from "../features/books/bookSlice"

export const store = configureStore({
    reducer: {
        theme : themeReducer,
        auth : authReducer,
        books : booksReducer,

    },
});

// console.log(store.getState);


// Type helpers for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/*

export type RootState = ReturnType<typeof store.getState>;
store.getState is a function that returns your app’s entire Redux state object.

ReturnType<typeof store.getState> means “whatever type that function returns”.

So RootState is the type of your entire Redux state.

Example:
If your store has:

ts
Copy code
reducer: {
  theme: themeReducer,
  user: userReducer,
}
then RootState looks like:

ts
Copy code
type RootState = {
  theme: ThemeState;
  user: UserState;
}
*/
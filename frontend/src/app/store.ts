import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import authReducer from "../features/auth/authSlice"

export const store = configureStore({
    reducer: {
        theme : themeReducer,
        auth : authReducer,
    },
});

console.log(store.getState);


// Type helpers for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
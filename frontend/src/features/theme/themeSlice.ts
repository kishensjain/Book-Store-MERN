import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
}

const persisted = (localStorage.getItem("theme") as ThemeMode) || null;
const initialState: ThemeState = {
  mode: persisted ?? "light",
};

const slice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setTheme(state, action:PayloadAction<ThemeMode>){
        state.mode = action.payload;
        localStorage.setItem("theme", state.mode)
    }
  },
});

export const {toggleTheme, setTheme} = slice.actions;
export default slice.reducer
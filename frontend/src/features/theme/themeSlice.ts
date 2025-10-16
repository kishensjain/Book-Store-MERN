import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
}

const persisted = (localStorage.getItem("theme") as ThemeMode) || null;
const initialState: ThemeState = {
  mode: persisted ?? "light",
};

const slice = createSlice({ //read comment below for explaination
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
    setTheme(state, action:PayloadAction<ThemeMode>){
        state.mode = action.payload;
        localStorage.setItem("theme", state.mode)
    }
  },
});

export const {toggleTheme, setTheme} = slice.actions;
export default slice.reducer

/*
Key points:

You wrote reducers in createSlice — that’s your input.
Redux Toolkit renames it internally as caseReducers.

slice.reducer exists automatically — Redux Toolkit creates it for you.
It’s a single function that:
  Takes the current state and an action
  Looks up the corresponding reducer in caseReducers
  Applies Immer to produce a new state

So even though you never wrote slice.reducer, it exists.
*/

/*
createSlice() returns an object that looks like this (simplified):
{
  name: "theme",
  reducer: (state, action) => { ... },   // <— combined reducer function
  actions: {                             // <— auto-generated action creators
    toggleTheme: () => ({ type: "theme/toggleTheme" }),
    setTheme: (payload) => ({ type: "theme/setTheme", payload }),
  },
  caseReducers: {                        // <— your original reducers
    toggleTheme: (state) => { ... },
    setTheme: (state, action) => { ... },
  },
}
*/
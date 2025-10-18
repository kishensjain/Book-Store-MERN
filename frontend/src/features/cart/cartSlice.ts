import { createSlice } from "@reduxjs/toolkit";


export interface CartItem{
    bookId : string | null,
    title : string | null,
    price : number,
    coverImage : string | null,
    quantity : number,
}

interface CartState {
  items: CartItem[];
}

const initialState : CartState = {
    items : []
}


const slice = createSlice({
    name:"cart",
    initialState,
    reducers:{}
})
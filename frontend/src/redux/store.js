import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import productsSlice from "./productsSlice.js";
import productDetailsSlice from "./productDetailsSlice.js";
import profileSlice from "./profileSlice.js";
import cartSlice from "./cartSlice.js";
import orderSlice from "./orderSlice.js";
import reviewSlice from "./reviewSlice.js";

export const store = configureStore({
  reducer: {
    userSlice,
    productsSlice,
    productDetailsSlice,
    profileSlice,
    cartSlice,
    orderSlice,
    reviewSlice
  },
});
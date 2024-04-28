import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    shippingInfo: localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) : {},
    isItemExist: null,
    item: null,
};

export const cartReducer = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Add to cart
        addToCart(state, action) {
            state.item = action.payload;
            state.isItemExist = state.cartItems?.find((i) => i?.product === state.item?.product);
            if (state.isItemExist) {
                state.cartItems = state?.cartItems.map((i) => i?.product === state.isItemExist?.product ? state.item : i);
                // console.log(state.cartItems);
                state.isItemExist = null;
                state.item = null;
            } else {
                state.cartItems.push(state.item)
                state.item = null
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        // Remove from cart
        removeFromCart(state, action) {
            state.cartItems = state.cartItems.filter((i) => i.product !== action.payload)
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        saveShippingInfo(state, action) {
            state.shippingInfo = action.payload;
            localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    saveShippingInfo,
} = cartReducer.actions;

export default cartReducer.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productDetails: [],
  loading: false,
  error: null,
  success: false,
};

export const productDetailsReducer = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    productDetailsFetching(state) {
      state.loading = true;
    },
    productDetailsFetched(state, action) {
      state.loading = false;
      state.productDetails = action.payload.product;
    },
    productDetailsError(state, action) {
      state.loading = false;
      state.productDetails = null;
      state.error = action.payload;
    },
    productUpdateReq(state) {
      state.loading = true;
    },
    productUpdateFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    productUpdateClrErr(state) {
      state.error = false;
    },
    productUpdateReset(state) {
      state.success = false;
    },
    productUpdateSuccess(state, action) {
      console.log(action.payload);
      state.loading = false;
      state.success = action.payload.success;
      state.productDetails = action.payload.data.product;
    },

  },
});

export const {
  productDetailsFetching,
  productDetailsFetched,
  productDetailsError,
  productUpdateSuccess,
  productUpdateClrErr,
  productUpdateFail,
  productUpdateReq,
  productUpdateReset,
} =
  productDetailsReducer.actions;

export default productDetailsReducer.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: [],
  productsCount: 0,
  resultPerPage: 0,
  filteredProductsCount: 0,
  loading: false,
  error: null,
  success: null,
};

export const productReducer = createSlice({
  name: "product",
  initialState,
  reducers: {
    productFetching(state) {
      state.loading = true;
    },
    productFetched(state, action) {
      state.loading = false;
      state.product = action.payload.products;
      state.productsCount = action.payload.productCount;
      state.resultPerPage = action.payload.resultPerPage;
      state.filteredProductsCount = action.payload.filteredProductsCount;
    },
    productError(state, action) {
      state.loading = false;
      state.product = null;
      state.productsCount = 0;
      state.resultPerPage = 0;
      state.filteredProductsCount = 0;
      state.error = action.payload;
    },
    productReset(state) {
      state.error = null;
      state.success = false;
    },
    newReviewReq(state) {
      state.loading = true;
    },
    newReviewSuccess(state, action) {
      state.loading = false;
      state.success = action.payload;
    },
    newReviewFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    newReviewReset(state) {
      state.success = false;
      state.error = null;
    },
    newReviewClrErr(state) {
      state.error = null;
    },
    adminProductReq(state) {
      state.loading = true;
    },
    adminProductSuccess(state, action) {
      state.loading = false;
      state.product = action.payload;
    },
    adminProductFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    newProductReq(state) {
      state.loading = true;
    },
    newProductSuccess(state, action) {
      state.loading = false;
      state.product = action.payload.products;
      state.success = action.payload.success;
    },
    newProductFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  productFetching,
  productFetched,
  productError,
  newReviewClrErr,
  newReviewFail,
  newReviewReq,
  newReviewReset,
  newReviewSuccess,
  productReset,
  adminProductFail,
  adminProductReq,
  adminProductSuccess,
  newProductFail,
  newProductReq,
  newProductSuccess,
} =
  productReducer.actions;

export default productReducer.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reviews: [],
    loading: false,
    error: null,
    success: false,
};

export const reviewReducer = createSlice({
    name: "review",
    initialState,
    reducers: {
        AllreviewsRequest(state) {
            state.loading = true;
        },
        AllreviewsSuccess(state, action) {
            state.loading = false;
            state.reviews = action.payload;
        },
        AllreviewsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        DeletereviewRequest(state) {
            state.loading = true;
        },
        DeletereviewSuccess(state) {
            state.loading = false;
        },
        DeletereviewFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetSuccess(state) {
            state.success = false;
        },
    },
});

export const {
    AllreviewsFail,
    AllreviewsRequest,
    AllreviewsSuccess,
    DeletereviewFail,
    DeletereviewRequest,
    DeletereviewSuccess,
    resetSuccess,
} = reviewReducer.actions;

export default reviewReducer.reducer;
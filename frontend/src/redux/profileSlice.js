import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isUpdated: null,
    loading: false,
    error: null,
    message: null,
    success:null,
};

export const profileReducer = createSlice({
    name: "profile",
    initialState,
    reducers: {
        updateProfileRequest(state) {
            state.loading = true;
        },
        updateProfileSuccess(state) {
            state.loading = false;
            state.isUpdated = true;
        },
        updateProfileError(state, action) {
            state.loading = false;
            state.isUpdated = null;
            state.error = action.payload;
        },
        updateProfileReset(state) {
            state.isUpdated = false;
        },
        updatePasswordRequest(state) {
            state.loading = true;
        },
        updatePasswordSuccess(state) {
            state.loading = false;
            state.isUpdated = true;
        },
        updatePasswordError(state, action) {
            state.loading = false;
            state.isUpdated = null;
            state.error = action.payload;
        },
        updatePasswordReset(state) {
            state.error = null;
            state.isUpdated = false;
        },
        forgotPassStart(state) {
            state.loading = true;
        },
        forgotPassSuccess(state, action) {
            state.loading = false;
            state.isUpdated = true;
            state.message = action.payload;
        },
        forgotPassFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetPassStart(state) {
            state.loading = true;
            state.error = null;
        },
        resetPassSuccess(state, action) {
            state.loading = false;
            state.success = action.payload;
        },
        resetPassFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    updateProfileError,
    updateProfileRequest,
    updateProfileReset,
    updateProfileSuccess,
    updatePasswordRequest,
    updatePasswordError,
    updatePasswordSuccess,
    updatePasswordReset,
    forgotPassSuccess,
    forgotPassFail,
    forgotPassStart,
    resetPassFail,
    resetPassStart,
    resetPassSuccess,
} = profileReducer.actions;

export default profileReducer.reducer;
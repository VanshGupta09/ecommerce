import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: false,
  userData: null,
  loading: false,
  error: null,
  allUsers: [],
  searchedUser: null,
  userDeleted: false,
  userUpdated: false,
  message: null,
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    startFetching(state) {
      state.loading = true;
    },
    successFetching(state, action) {
      state.auth = true;
      state.loading = false;
      state.userData = action.payload;
    },
    errorFetching(state, action) {
      state.auth = false;
      state.loading = false;
      state.userData = null;
      state.error = action.payload;
    },
    startRegister(state) {
      state.loading = true;
    },
    successRegister(state, action) {
      state.auth = true;
      state.loading = false;
      state.userData = action.payload;
    },
    errorRegister(state, action) {
      state.auth = false;
      state.loading = false;
      state.userData = null;
      state.error = action.payload;
    },
    autoLoginUser(state) {
      state.loading = true;
    },
    autoLoginSuccess(state, action) {
      state.auth = true;
      state.loading = false;
      state.userData = action.payload;
    },
    errorAutoLogin(state, action) {
      state.auth = false;
      state.loading = false;
      state.userData = null;
      state.error = action.payload;
    },
    logoutStart(state) {
      state.loading = true;
    },
    logoutSuccess(state) {
      state.auth = false;
      state.loading = false;
      state.userData = null;
      state.error = null;
    },
    logoutFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    allUsersReq(state) {
      state.loading = true;
    },
    allUsersSuccess(state, action) {
      state.loading = false;
      state.allUsers = action.payload;
    },
    allUsersFail(state, action) {
      state.loading = true;
      state.error = action.payload;
    },
    userDetailsReq(state) {
      state.loading = true;
    },
    userDetailsSuccess(state, action) {
      state.loading = false;
      state.searchedUser = action.payload;
    },
    userDetailsFail(state, action) {
      state.loading = true;
      state.error = action.payload;
    },
    userUpdateReq(state) {
      state.loading = true;
    },
    userUpdateSuccess(state, action) {
      state.loading = false;
      state.userUpdated = action.payload.success;
    },
    userUpdateFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    userDeleteReq(state) {
      state.loading = true;
    },
    userDeleteSuccess(state, action) {
      state.loading = false;
      state.userDeleted = action.payload.success;
      state.message = action.payload.message;
    },
    userDeleteFail(state, action) {
      state.loading = true;
      state.error = action.payload;
    },
    resetState(state) {
      state.message = null;
      state.userDeleted = false;
      state.userUpdated =false;
    }
    , clrErr(state) {
      state.error = null;
    },
  },
});

export const {
  startFetching,
  successFetching,
  errorFetching,
  startRegister,
  successRegister,
  errorRegister,
  autoLoginUser,
  autoLoginSuccess,
  errorAutoLogin,
  logoutStart,
  logoutSuccess,
  logoutFail,
  allUsersFail,
  allUsersReq,
  allUsersSuccess,
  userDeleteFail,
  userDeleteReq,
  userDeleteSuccess,
  userDetailsFail,
  userDetailsReq,
  userDetailsSuccess,
  userUpdateFail,
  userUpdateReq,
  userUpdateSuccess,
  resetState,
  clrErr,
} = userReducer.actions;

export default userReducer.reducer;
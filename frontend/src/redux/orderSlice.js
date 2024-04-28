import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    order: null,
    orders: null,
    allOrders: [],
    isUpdated: false,
    isDeleted: false,
    totalAmount:0,
};

export const orderReducer = createSlice({
    name: "order",
    initialState,
    reducers: {
        createOrderReq(state) {
            state.loading = true;
        },
        createOrderSuccess(state, action) {
            state.loading = false;
            state.order = action.payload;
        },
        createOrderFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        orderClearErrors(state) {
            state.error = null;
        },
        myOrdersRequest(state) {
            state.loading = true;
        },
        myOrdersSuccess(state, action) {
            state.loading = false;
            state.orders = action.payload;
        },
        myOrdersSuccessWIthTotalAmount(state, action) {
            state.loading = false;
            state.orders = action.payload.orders;
            state.totalAmount=action.payload.totalAmouunt;
        },
        myOrdersFail(state, action) {
            state.error = action.payload;
        },
        myOrdersClrErr(state, action) {
            state.error = null;
        },
        orderDetailsReq(state) {
            state.loading = true;
        },
        orderDetailsSuccess(state, action) {
            state.loading = false;
            state.order = action.payload;
        },
        orderDetailsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        orderDetailsError(state) {
            state.error = null;
        },
        orderUpdateReq(state) {
            state.loading = true;
        },
        orderUpdateSuccess(state, action) {
            state.loading = false;
            state.allOrders = action.payload.data.orders;
            state.isUpdated = action.payload.success
        },
        orderUpdateFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        orderUpdateError(state, action) {
            state.error = action.payload;
        },
        orderUpdateReset(state) {
            state.isUpdated = false;
        },
        deleteOrderReq(state) {
            state.loading = true;
        },
        deleteOrderSuccess(state,action) {
            state.isDeleted = action.payload;
        },
        deleteOrderFail(state,action) {
            state.error = action.payload;
        },
        deleteOrderReset(state,action) {
            state.isDeleted = false;
        },
    },
});

export const {
    createOrderFail,
    createOrderReq,
    createOrderSuccess,
    orderClearErrors,
    myOrdersClrErr,
    myOrdersFail,
    myOrdersRequest,
    myOrdersSuccessWIthTotalAmount,
    myOrdersSuccess,
    orderDetailsError,
    orderDetailsFail,
    orderDetailsReq,
    orderDetailsSuccess,
    orderUpdateError,
    orderUpdateFail,
    orderUpdateReq,
    orderUpdateReset,
    orderUpdateSuccess,
    deleteOrderFail,
    deleteOrderReq,
    deleteOrderSuccess,
    deleteOrderReset,
} = orderReducer.actions;

export default orderReducer.reducer;
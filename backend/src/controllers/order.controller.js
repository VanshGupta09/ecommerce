import { Order } from "../models/order.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js"
import ApiError from "../utils/ApiError.js";

async function updateStock(quantity, id) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

const createOrder = asyncHandler(async (req, res) => {
    const { shippingInfo, orderedItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice } = req?.body;

    const order = await Order.create({
        shippingInfo,
        orderedItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req?.user,
        // user: req?.user._id,
    })

    res.status(200).json(
        new ApiResponse(200, { order }, "Order created successfully")
    )
})

const getSingleOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req?.params?.id).populate("user", "name email");

    if (!order) {
        throw new ApiError(500, "Order id invalid")
    }

    res.status(200).json(
        new ApiResponse(200, { order }, "Order fetched successfully")
    )
})

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req?.user?.id })

    res.status(200).json(
        new ApiResponse(200, { orders }, "Order fetched successfully")
    )
})

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find();

    let totalAmouunt = 0;
    orders.forEach(elm => totalAmouunt += elm?.totalPrice);

    res.status(200).json(
        new ApiResponse(200, { orders, totalAmouunt }, "Order fetched successfully")
    )
})

const updateOrderStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req?.params?.id);

    if (!order) {
        throw new ApiError(400, "Order did not found")
    }

    if (order?.orderStatus === "Delivered") {
        throw new ApiError(400, "Order already delivered")
    }

    if (req.body.status === "Shipped") {
        order.orderedItems.forEach(async order => {
            await updateStock(order.quantity, order.product._id);
        });
    }

    order.orderStatus = req?.body?.status;

    if (req?.body?.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false })

    res.status(200).json(
        new ApiResponse(200, { order }, "Order status updated successfully")
    )
})

const deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req?.params?.id);

    if (!order) {
        throw new ApiError(400, "Order did not found")
    }

    await Order.findByIdAndDelete(req?.params?.id)

    res.status(200).json(
        new ApiResponse(200, {}, "Order deleted successfully")
    )
})

export {
    createOrder,
    getSingleOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
}
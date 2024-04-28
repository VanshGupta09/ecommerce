import express from "express";
import { createOrder, deleteOrder, getAllOrders, getMyOrders, getSingleOrder, updateOrderStatus } from "../controllers/order.controller.js";
import { verifyJWT, authoriseRoles } from "../middlewares/auth.js";

const router = express.Router();

router.route("/order/create").post(verifyJWT, createOrder);
router.route("/order/:id").get(verifyJWT, getSingleOrder);
router.route("/orders").get(verifyJWT, getMyOrders);
router.route("/admin/orders").get(verifyJWT, authoriseRoles("admin"), getAllOrders);
router.route("/admin/:id")
.patch(verifyJWT, authoriseRoles("admin"), updateOrderStatus)
.delete(verifyJWT, authoriseRoles("admin"), deleteOrder);

export default router;
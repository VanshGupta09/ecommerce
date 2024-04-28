import express from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { processPayment, sendStripeApiKey } from "../controllers/payment.controller.js";

const router = express.Router();

router.route("/payment/process").post(verifyJWT, processPayment);
router.route("/stripeapikey").get(verifyJWT, sendStripeApiKey);

export default router;
import stripe from 'stripe';
import asyncHandler from '../utils/asyncHandler.js';

export const processPayment = asyncHandler(async (req, res) => {
    const stripeKey = new stripe(process.env.STRIPE_SECRET_KEY);
    const myPayment = await stripeKey.paymentIntents.create({
        amount: req.body?.amount,
        currency: "inr",
        description: "Payment to ecommerce",
        // Optional
        metadata: {
            company: "Ecommerce",
        },
    })

    res
        .status(200)
        .json({ success: true, client_secret: myPayment.client_secret })
})

export const sendStripeApiKey = asyncHandler(async (req, res) => {
    res
        .status(200)
        .json({ success: true, stripeApiKey: process.env.STRIPE_API_KEY })
})
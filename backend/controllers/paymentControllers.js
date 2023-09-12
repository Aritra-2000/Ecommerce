import {catchAsyncError} from "../middleware/catchAsyncError.js";
import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorsHandler.js";
import stripe from "stripe";
import dotenv from 'dotenv'

dotenv.config({path:"backend/config/config.env"});


const Stripe = stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    if(user.role === 'Admin'){
        return next(new ErrorHandler("Admin Can't buy subscription", 400));
    }

    const myPayment = await Stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "INR",
        metadata: {
          company : "Ecommerce"  
        },
    });

    res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret
    })
});


export const sendStripeApiKey = catchAsyncError(async(req, res, next) => {

    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    });
})

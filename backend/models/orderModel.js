import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pinCode: {
            type: Number,
            require: true,
        },
        phoneNo: {
            type: Number,
            required: true,
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true,
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true,
    },
    paymentInfo: {
        id: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true
        }
    },
    paidAt: {

        type: String,
        required: true
    },
    itemsPrice:{
        type: String,
        default:0,
        required: true
    },
    taxPrice:{
        type: String,
        default:0,
        required: true
    },
    shippingPrice:{
        type: String,
        default:0,
        required: true
    },
    totalPrice:{
        type: String,
        default:0,
        required: true
    },
    orderStatus:{
        type: String,
        default:"Processing",
        required: true
    },
    deliveredAt: Date,
    createdAt:{
        type: Date,
        default: Date.now
    }
});

export const Order = mongoose.model("Order", orderSchema);
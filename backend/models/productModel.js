import mongoose from 'mongoose'

const productSchem = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        maxLength: [8, "Price cannot exceed 8 charecter"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }

        }
    ],
    category:{
        type: String,
        required:[true,"Please Enter product category"]
    },
    stock:{
        type:Number,
        required: [true,"Please Enter product stock"],
        maxLength: [4, "Stock cannot exceed 4 charecter"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default: 0
    },
    reviews:[
        {
            user:{
                type: mongoose.Schema.ObjectId,
                ref: "User",
                require: true,
            },
            name:{
                type: String,
                required:true
            },
            rating:{
                type:Number,
                require:true
            },
            comment:{
                type:String,
                require:true
            }
        }
    ],

    user:{
       type: mongoose.Schema.ObjectId,
       ref: "User",
       require: true,
    },

    createdAt:{
        type: Date,
        default: Date.now
    }

})


export const Product =  mongoose.model("product", productSchem);
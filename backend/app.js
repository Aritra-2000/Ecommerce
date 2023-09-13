import express from 'express'
export const app = express();
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import dotenv from 'dotenv';
import cors from 'cors';

import ErrorMiddleware from './middleware/error.js'

// Route imports
import product from "./routes/productRoute.js";
import user from "./routes/userRoute.js";
import order from "./routes/orderRoute.js";
import payment from "./routes/paymentRoute.js";

// config
dotenv.config({path:"backend/config/config.env"});

app.use(express.json({ limit: '50mb'}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

// app.use(cors(
//     {
//         origin: [],
//         methods: ["POST", "GET"],
//         credentials: true
//     }
// ));

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);


// Middleware for Errors
app.use(ErrorMiddleware);
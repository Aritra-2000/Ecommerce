import {app} from "./app.js";
import dotenv from 'dotenv';
import cloudinary from "cloudinary";
import connectDatabase from "./config/db.js";

// Handling uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shuting down the server due to Uncaught Exception`);
    process.exit(1);
});

// config
dotenv.config({path:"backend/config/config.env"});

// connecting to Database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

 const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})


// Unhandeled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandeled Rejection`);

    server.close(() =>{
        process.exit(1);
    });
});
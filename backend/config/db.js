import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const connectDatabase =( )=>{

    mongoose.connect(process.env.DB_URI,{useNewUrlParser: true, useUnifiedTopology: true}).then(
        (data)=>{
            console.log(`Mongodb connected with server : ${data.connection.host}`);
        });
}


export default connectDatabase;
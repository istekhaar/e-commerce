import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";

dotenv.config({path: './.env'})


connectDB()
.then(()=>{
    try {
        app.listen(process.env.PORT || 5000 , ()=>{
            console.log(`server is runing at ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("app error=> ",error);
        
    }
})
.catch((err)=>{
    console.log("mongo db connection faild !!! ",err);
    
})
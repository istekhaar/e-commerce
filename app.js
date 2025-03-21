import express from "express";
import cookieParse from "cookie-parser";
import cors from "cors";


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGEN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParse())

//routes
import userRouter from "./routes/user.js";


//routes declaration
app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register

export { app }
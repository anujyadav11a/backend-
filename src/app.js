import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app=express()


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))//configuration of cors

app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded({extended:true,limit:"10kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import

import userRoutes from "./routes/usser.routes.js"
// route declaration

app.use("/api/v1/User",userRoutes)

export {app}
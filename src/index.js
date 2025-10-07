
import dotenv from "dotenv"
import connectDB from "./db/Db.js";

dotenv.config({
    path: './.env'
})



connectDB()

/*
import express from "express"
const app=express()


;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.error("ERR:",error)
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`app listen on the port ${process.env.PORT}`);
        })
        
    } catch (error) {
        console.error("ERRR:", error)
        throw error
    }
})()*/
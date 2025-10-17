
import dotenv from "dotenv"
import connectDB from "./db/Db.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})


//when database is connected it return a promise so use .then & .catch
connectDB()
    .then(() => {
       

        const server = app.listen(process.env.PORT || 3000, () => {
            console.log(`server is running on port ${process.env.PORT}`);
        })

        server.on("error", (error) => {
            console.error("ERRR:", error)
            process.exit(1)
        })

    })
    .catch((error) => {
        console.error(`mongo db connection failed!!`, error)
        process.exit(1)
    })

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
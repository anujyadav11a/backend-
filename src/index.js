
import dotenv from "dotenv"
import connectDB from "./db/Db.js";

dotenv.config({
    path: './.env'
})


//when database is connected it return a promise so use .then & .catch
connectDB()
    .then(() => {
       

        const server = app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running on port ${process.env.PORT}`);
        })

        server.on("error", (error) => {
            console.error("ERRR:", error)
            throw error
        })

    })
    .catch(() => {
        console.log(`mongo db connection failed!!`, error)

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
// import dotenv from 'dotenv'
// dotenv.config()

import "dotenv/config";
import app from './app.js'
import mongoose from 'mongoose'
import ConnectMongoDB from './config/DB.config.js'



const PORT = process.env.PORT || 5000

ConnectMongoDB()

app.listen(PORT,"0.0.0.0",()=>{
    console.log(`BACKEND IS RUNNING ON PORT https://apnamenswear.onrender.com/:${PORT}/`)
})






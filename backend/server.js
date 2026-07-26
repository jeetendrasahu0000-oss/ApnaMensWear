import app from './app.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import ConnectMongoDB from './config/DB.config.js'

dotenv.config()

const PORT = process.env.PORT || 5000

ConnectMongoDB()

app.listen(PORT,()=>{
    console.log(`BACKEND IS RUNNING ON PORT http://localhost:${PORT}/`)
})
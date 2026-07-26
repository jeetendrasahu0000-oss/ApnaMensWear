import express from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import AllRoutes from './modules/index.js'


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(compression())
app.use(cors(
    {
        origin:["http://localhost:517",],
        credentials :true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }
))




app.use(AllRoutes)


app.use('/',(req,res)=>{
    return res.status(200).json({success:true,message:"backend runing successfully...",data:null,error:null})
})

export default app
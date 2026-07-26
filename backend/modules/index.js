import express from "express";


import ProductRouter from "./products/routes/ProductCrudRoutes.js";
import OtpRouter from "../routes/otpRoutes.js";
import UserValidationRoutes from "./user/routes/UserValidation.Routes.js";
import userRouter from "./user/routes/UserLoginSignup.Routes.js";



const Router = express.Router()

Router.use('/api/v1/otp/',OtpRouter)

Router.use('/api/v1/products',ProductRouter)

Router.use('/api/v1/user/validation/',UserValidationRoutes)

Router.use('/api/v1/user/',userRouter)

// Router.use('/api/v1/orders')
// Router.use('/api/v1/admin')



// http://localhost:5000/


export default Router
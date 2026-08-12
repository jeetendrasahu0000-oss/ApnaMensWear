import express from "express";


import ProductRouter from "./products/routes/ProductCrudRoutes.js";
import OtpRouter from "../routes/otpRoutes.js";
import UserValidationRoutes from "./user/routes/UserValidation.Routes.js";
import userRouter from "./user/routes/UserLoginSignup.Routes.js";
import userCartRoutes from "./user/routes/USerCart.Routes.js";
import imageRoutes from "./cloudinery/routes/Basic.Routes.js";
import orderRoutes from "./order/routes/Order.routes.js";
import UserAdminRoutes from "./user/routes/UserAdmin.Routes.js";
import PaymentRoutes from "./payment/Routes/Payment.Routes.js";



const Router = express.Router()

Router.use('/api/v1/otp',OtpRouter)

Router.use('/api/v1/products',ProductRouter)

Router.use('/api/v1/images',imageRoutes)

Router.use('/api/v1/order',orderRoutes)

Router.use('/api/v1/payment',PaymentRoutes)


Router.use('/api/v1/user/validation',UserValidationRoutes)
Router.use('/api/v1/user',userRouter)
Router.use('/api/v1/cart',userCartRoutes)
Router.use('/api/v1/user/admin',UserAdminRoutes)




// Router.use('/api/v1/admin')



// http://localhost:5000/


export default Router
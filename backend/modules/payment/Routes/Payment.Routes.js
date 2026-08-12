import express from 'express';
import { CreateRazorpayOrder, CreateRefund, TestRazorpay, VerifyRazorpayPayment } from '../Controller/Payment.Controller.js';
import { Authontication, Authorization } from '../../user/middleware/AuthMiddleware.js';
import { GetAllPayments } from '../Controller/AdminPayment.Controller.js';


const PaymentRoutes = express.Router()



PaymentRoutes.get('/test',TestRazorpay)
PaymentRoutes.post('/create-order',Authontication,Authorization(['buyer',"admin"]),CreateRazorpayOrder)
PaymentRoutes.post('/verify',Authontication,Authorization(['buyer',"admin"]),VerifyRazorpayPayment)

PaymentRoutes.post('/refund/:paymentId',Authontication,Authorization(["admin"]),CreateRefund)
PaymentRoutes.get('/admin/all',Authontication,Authorization(["admin"]),GetAllPayments)

// http://localhost:5000/api/v1/payment/test



export default PaymentRoutes
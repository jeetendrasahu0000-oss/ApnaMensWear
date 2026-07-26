import express from 'express'
import { setOtpController, verifyOtpController } from '../controllers/OtpControllers.js'

const OtpRouter = express.Router()

OtpRouter.post('/set-otp',setOtpController)
OtpRouter.post('/verify-otp',verifyOtpController)

export default OtpRouter
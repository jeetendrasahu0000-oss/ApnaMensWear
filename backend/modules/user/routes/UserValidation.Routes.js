import express from 'express'
import { isEmailExistsController, isPhoneExistsController } from '../controllers/UserValidation.Controller.js'

const UserValidationRoutes = express.Router()

UserValidationRoutes.get('/is-email-exist/:phoneNo',isEmailExistsController)
UserValidationRoutes.get('/is-phone-exist/:email',isPhoneExistsController)


// // http://localhost:5000/api/v1/user/validation/is-email-exist

export  default UserValidationRoutes


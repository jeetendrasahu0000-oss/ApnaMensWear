import express from 'express'
import { DeleteUser, GetAllUsers, GetSingleUser, UpdateUser } from '../controllers/UserAdminController.js';

const UserAdminRoutes = express.Router()


UserAdminRoutes.get('/',GetAllUsers)
UserAdminRoutes.get('/singel/:userId',GetSingleUser)
UserAdminRoutes.post('/update/:userId',UpdateUser)
UserAdminRoutes.post('/remove/:userId',DeleteUser)




// http://localhost:5000/api/v1/user/admin/update

export default UserAdminRoutes;
import express from 'express'
import { DeleteUser, GetAllUsers, GetSingleUser, UpdateUser } from '../controllers/UserAdminController.js';
import { Authontication, Authorization } from '../middleware/AuthMiddleware.js';

const UserAdminRoutes = express.Router()



UserAdminRoutes.get('/',Authontication,Authorization(["admin"]),GetAllUsers)
UserAdminRoutes.get('/singel/:userId',Authontication,Authorization(["buyer","admin"]),GetSingleUser)
UserAdminRoutes.post('/update/:userId',Authontication,Authorization(["admin"]),UpdateUser)
UserAdminRoutes.post('/remove/:userId',Authontication,Authorization(["admin"]),DeleteUser)




// http://localhost:5000/api/v1/user/admin/update

export default UserAdminRoutes;
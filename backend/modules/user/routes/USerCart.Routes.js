import express from 'express'
import { AddToCart, GetCart, RemoveCartItem } from '../controllers/UserCart.Controller.js';
import { Authontication, Authorization } from '../middleware/AuthMiddleware.js';

const userCartRoutes = express.Router()

// ,Authontication,Authorization(["admin","buyer"])

userCartRoutes.post('/add',Authontication,Authorization(["admin","buyer"]),AddToCart)
userCartRoutes.get('/',Authontication,Authorization(["admin","buyer"]),GetCart)
userCartRoutes.delete('/remove/:itemId',Authontication,Authorization(["admin","buyer"]),RemoveCartItem)


// http://localhost:5000/api/v1/cart/

export default userCartRoutes;


// ok know create a component to add to cart      for call api use api.post()   route  /v1/cart/add       make component popup 
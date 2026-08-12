import express from 'express'

import { DeleteProduct, GetAllProduct, RegesterProduct, UpdateProduct } from '../controllers/ProductCrudOpration.js'
import { GetFillterdProducts, GetProductDetails, GetProductsByCategory, GetRelatedProducts, SearchProducts } from '../controllers/ProductSearch.js'
import { Authontication, Authorization } from '../../user/middleware/AuthMiddleware.js'

const router = express.Router()


// for admin 
// ,Authontication,Authorization(["admin","buyer"])

router.get('/',GetAllProduct)
router.post('/regester',Authontication,Authorization(["admin"]),RegesterProduct)
router.put('/update/:id',Authontication,Authorization(["admin"]),UpdateProduct)
router.delete('/delete/:id',Authontication,Authorization(["admin"]),DeleteProduct)


// for users 

router.get('/details/:slug',GetProductDetails)
router.get('/category/:category',GetProductsByCategory)
router.get('/related',GetRelatedProducts)
router.get('/filtered',GetFillterdProducts)
router.get('/search',SearchProducts)



export default router
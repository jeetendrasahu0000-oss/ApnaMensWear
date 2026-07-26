import express from 'express'

import { DeleteProduct, GetAllProduct, RegesterProduct, UpdateProduct } from '../controllers/ProductCrudOpration.js'
import { GetFillterdProducts, GetProductDetails, GetProductsByCategory, GetRelatedProducts, SearchProducts } from '../controllers/ProductSearch.js'
import { Authontication, Authorization } from '../../user/middleware/AuthMiddleware.js'

const router = express.Router()


// for admin 

router.get('/',Authontication,Authorization(["admin","buyer"]),GetAllProduct)
router.post('/regester',RegesterProduct)
router.put('/update/:id',UpdateProduct)
router.delete('/delete/:id',DeleteProduct)


// for users 

router.get('/details/:slug',GetProductDetails)
router.get('/category/:category',GetProductsByCategory)
router.get('/related/:id',GetRelatedProducts)
router.get('/filtered',GetFillterdProducts)
router.get('/search',SearchProducts)



export default router
import { Router } from 'express'
import { getAllProducts, getProductsByCategory } from '../controllers/productController'

const router = Router()

router.get('/', getAllProducts)
router.get('/category/:category', getProductsByCategory)

export default router

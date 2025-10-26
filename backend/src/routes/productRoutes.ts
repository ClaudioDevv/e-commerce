import { Router } from 'express'
import { getAllProducts, getProductsByCategory, getProductByIdentifier } from '../controllers/productController'

const router = Router()

router.get('/', getAllProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/:id', getProductByIdentifier)

export default router

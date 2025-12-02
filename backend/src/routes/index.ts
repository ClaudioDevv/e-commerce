import { Router } from 'express'
import authRoutes from './authRoutes'
import productRoutes from './productRoutes'
import ingredientRoutes from './ingredientRoutes'
import addressRoutes from './addressRoutes'
import cartRoutes from './cartRoutes'
import orderRoutes from './orderRoutes'

const router = Router()

// Montar todas las rutas
router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/ingredients', ingredientRoutes)
router.use('/addresses', addressRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)

export default router

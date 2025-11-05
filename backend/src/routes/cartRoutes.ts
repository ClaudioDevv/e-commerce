import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import * as cartController from '../controllers/cartController'
import { validateRequest } from '../middlewares/validateRequest'
import { cartItemSchema, updateCartItemSchema } from '../validators/cartValidator'

const router = Router()

router.use(authenticate)

router.get('/', cartController.getAllCart)
router.get('/summary', cartController.getSummary)

router.post('/items', validateRequest(cartItemSchema), cartController.addToCart)

router.put('/items/:id', validateRequest(updateCartItemSchema), cartController.updateCartItem)

router.delete('/items/:id', cartController.deleteItem)
router.delete('/items', cartController.clearCart)

export default router

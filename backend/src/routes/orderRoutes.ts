import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import { validateRequest } from '../middlewares/validateRequest'
import { orderUserSchema, orderGuestSchema } from '../validators/orderValidator'
import * as OrderController from '../controllers/orderController'

const router = Router()

router.post('/', authenticate, validateRequest(orderUserSchema), OrderController.createOrderUserlogged)
router.post('/guest', validateRequest(orderGuestSchema), OrderController.createOrderGuest)

router.get('/', authenticate, OrderController.getAllOrders)
router.get('/:id', authenticate, OrderController.getOrderById)

router.patch('/:id/cancel', authenticate, OrderController.cancelOrder)

export default router

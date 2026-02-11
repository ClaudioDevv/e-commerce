import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import { validateRequest } from '../middlewares/validateRequest'
import { orderUserSchema, orderGuestSchema } from '../validators/orderValidator'
import * as OrderController from '../controllers/orderController'

const router = Router()

router.post('/', authenticate, validateRequest(orderUserSchema), OrderController.createOrderUserlogged)
router.post('/guest', validateRequest(orderGuestSchema), OrderController.createOrderGuest)
router.post('/:id/checkout', authenticate, OrderController.payOrderStripe)
router.post('/guest/:id/checkout', OrderController.payOrderGuestStripe)

router.get('/', authenticate, OrderController.getAllOrders)
router.get('/:id', authenticate, OrderController.getOrderById)
router.get('/is-open', OrderController.checkIfOpen)
router.get('/available-times', OrderController.getAvailableTimeSlots)

router.patch('/:id/cancel', authenticate, OrderController.cancelOrder)

export default router

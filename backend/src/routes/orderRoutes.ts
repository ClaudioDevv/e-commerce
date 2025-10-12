import { Router } from 'express'
import { } from '../controllers/orderController'

const router = Router()

router.post('/guest', createOrders)

export default router

import { Router, raw } from 'express'
import * as PaymentController from '../controllers/paymentController'

const router = Router()

router.post('/webhook', raw({ type: 'application/json' }), PaymentController.webhook)

export default router

import { Request, Response } from 'express'
import { stripe } from '../config/stripe'
import type Stripe from 'stripe'
import { AppError } from '../utils/AppError'
import * as OrderModel from '../models/order'
import * as PaymentModel from '../models/payment'
import { logger } from '../config/logger'

export const webhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['stripe-signature']

    if (!signature) {
      throw new AppError('Falta firma de Stripe', 400)
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new AppError('STRIPE_WEBHOOK_SECRET no configurado', 500)
    }

    // Verificar firma
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid webhook signature'

      logger.error('Invalid webhook signature', { message })
      return res.status(400).send(`Webhook Error: ${message}`)
    }

    // Manejar eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Extraer metadata
        const orderId = session.metadata?.orderId

        if (!orderId) {
          logger.error('Webhook session missing orderId')
          return res.status(400).json({ error: 'Missing orderId' })
        }

        const order = await OrderModel.findOrderById(orderId)

        if (!order) {
          logger.error('Order not found in webhook', { orderId })
          return res.status(404).json({ error: 'Order not found' })
        }

        if (order.status === 'PAID') {
          return res.status(200).json({ received: true })
        }

        await PaymentModel.confirmSuccess(orderId, session.payment_intent as string)

        logger.info('Payment succeeded', {
          orderId,
          paymentIntent: session.payment_intent,
          amount: session.amount_total
        })

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId

        if (orderId) {
          await OrderModel.expireOrder(orderId)
          logger.warn('Checkout session expired', { orderId })
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string

        if (paymentIntentId) {
          const payment = await PaymentModel.findByProviderId(paymentIntentId)

          if (payment && payment.status !== 'REFUNDED') {
            const refundId = charge.refunds?.data[0]?.id || null

            if (refundId) {
              await PaymentModel.markAsRefundedById(payment.id, refundId)
            }

            logger.info('Payment refunded', {
              paymentIntentId,
              refundId,
              orderId: payment.orderId
            })
          }
        }
        break
      }

      case 'charge.refund.updated': {
        const refund = event.data.object as Stripe.Refund

        if (refund.status === 'failed') {
          logger.error('Refund failed', { refundId: refund.id })
        }
        break
      }
    }

    // siempre responder con 200
    res.status(200).json({ received: true })
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message
      })
    }

    return res.status(200).json({ received: true })
  }
}

import { Request, Response } from 'express'
import { stripe } from '../config/stripe'
import type Stripe from 'stripe'
import { AppError } from '../utils/AppError'
import * as OrderModel from '../models/order'
import * as PaymentModel from '../models/payment'

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

      console.error('Firma de webhook inválida:', message)
      return res.status(400).send(`Webhook Error: ${message}`)
    }

    // Manejar eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Extraer metadata
        const orderId = session.metadata?.orderId

        if (!orderId) {
          console.error('Sesión sin orderId en metadata')
          return res.status(400).json({ error: 'Missing orderId' })
        }

        const order = await OrderModel.findOrderById(orderId)

        if (!order) {
          console.error(`Pedido ${orderId} no encontrado`)
          return res.status(404).json({ error: 'Order not found' })
        }

        if (order.status === 'PAID') {
          console.log(`Pedido ${orderId} ya estaba marcado como PAID`)
          return res.status(200).json({ received: true })
        }

        await PaymentModel.confirmPaymentSuccess(orderId, session.payment_intent as string)

        console.log(`Pedido ${orderId} marcado como PAID`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId

        if (orderId) {
          await OrderModel.expireOrder(orderId)
          console.log(`Sesión expirada para pedido ${orderId}`)
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string

        if (paymentIntentId) {
          const payment = await PaymentModel.getPaymentByProviderId(paymentIntentId)

          if (payment && payment.status !== 'REFUNDED') {
            const refundId = charge.refunds?.data[0]?.id || null

            if (refundId) {
              await PaymentModel.updatePaymentToRefundedById(payment.id, refundId)
            }

            console.log(`Reembolso confirmado para payment_intent ${paymentIntentId}`)
          }
        }
        break
      }

      case 'charge.refund.updated': {
        const refund = event.data.object as Stripe.Refund

        if (refund.status === 'failed') {
          console.log(`Reembolso fallido: ${refund.id}`)
        }
        break
      }
    }

    // siempre responder con 200
    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Error en webhook:', error)
    return res.status(400).json({ error: 'Webhook inválido' })
  }
}

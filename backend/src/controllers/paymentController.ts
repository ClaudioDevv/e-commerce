import { Request, Response } from 'express'
import 'dotenv/config'
import { stripe } from '../config/stripe'
import type Stripe from 'stripe'
import { prisma } from '../lib/prisma'
import { AppError } from '../utils/AppError'

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

        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { payment: true }
        })

        if (!order) {
          console.error(`Pedido ${orderId} no encontrado`)
          return res.status(404).json({ error: 'Order not found' })
        }

        if (order.status === 'PAID') {
          console.log(`Pedido ${orderId} ya estaba marcado como PAID`)
          return res.status(200).json({ received: true })
        }

        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID' }
          }),
          prisma.payment.update({
            where: { orderId },
            data: {
              status: 'SUCCEEDED',
              providerPaymentId: session.payment_intent as string
            }
          })
        ])

        console.log(`Pedido ${orderId} marcado como PAID`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' }
          })
          console.log(`Sesión expirada para pedido ${orderId}`)
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

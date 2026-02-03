/* eslint-disable camelcase */
import { AppError } from '../utils/AppError'
import { stripe } from '../config/stripe'
import { Prisma } from '../generated/prisma'

export type OrderForStripeCheckout = {
  id: string
  userId: string | null
  status: string
  deliveryFee: Prisma.Decimal
  payment: {
    provider: string
  } | null
  items: Array<{
    nameSnapshot: string
    unitPrice: Prisma.Decimal
    quantity: number
  }>
}

export const createStripeCheckoutSession = async (order: OrderForStripeCheckout) => {
  if (order.status !== 'PENDING') {
    throw new AppError('Este pedido no se puede pagar', 400)
  }

  if (order.payment?.provider !== 'STRIPE') {
    throw new AppError('Este pedido no está configurado para pago con Stripe', 400)
  }

  const line_items = order.items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.nameSnapshot,
      },
      unit_amount: Math.round(parseFloat(item.unitPrice.mul(100).toString()))
    },
    quantity: item.quantity,
  }))

  if (order.deliveryFee.greaterThan(0)) {
    line_items.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Gastos de envío',
        },
        unit_amount: Math.round(parseFloat(order.deliveryFee.mul(100).toString()))
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/order-cancelled`,
    metadata: {
      orderId: order.id,
      userId: order.userId
    }
  })

  return session
}

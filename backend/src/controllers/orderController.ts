import { Request, Response, NextFunction } from 'express'
import * as OrderModel from '../models/order'
import * as PaymentModel from '../models/payment'
import { AppError } from '../utils/AppError'
import { stripe } from '../config/stripe'
import { createStripeCheckoutSession } from '../services/stripeService'

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id

    const filters = {
      status: req.query.status as string | undefined,
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    }

    const result = await OrderModel.getAllOrders(userId, filters)

    res.status(200).json({
      success: true,
      data: result.orders,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const role = req.user!.role
    const { id } = req.params

    const order = await OrderModel.getOrderById(id, userId, role)

    res.status(200).json({
      success: true,
      data: order
    })
  } catch (error) {
    next(error)
  }
}

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const { order, payment } = await OrderModel.cancelOrder(id, userId)

    let refundProcessed = false

    if (order.status === 'CANCELLED' && payment) {
      if (payment.provider === 'STRIPE' && payment.status === 'SUCCEEDED' && payment.providerPaymentId) {
        try {
          const refund = await stripe.refunds.create({
            payment_intent: payment.providerPaymentId,
            metadata: {
              orderId: order.id,
              userId
            }
          })

          await PaymentModel.markAsRefundedByOrderId(order.id, refund.id)

          refundProcessed = true
        } catch (stripeError) {
          throw new AppError('Pedido cancelado pero hubo un error al procesar el reembolso. Contacta con soporte.', 500)
        }
      }
    }

    res.status(200).json({
      success: true,
      message: refundProcessed
        ? 'Pedido cancelado y reembolso procesado correctamente'
        : 'Pedido cancelado correctamente'
    })
  } catch (error) {
    next(error)
  }
}

export const createOrderUserlogged = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { deliveryType, scheduledFor, addressId, paymentProvider } = req.body

    const order = await OrderModel.createOrderUserLogged(userId, {
      deliveryType,
      scheduledFor,
      addressId,
      paymentProvider
    })

    res.status(201).json({
      success: true,
      message: 'Pedido creado correctamente',
      data: order
    })
  } catch (error) {
    next(error)
  }
}

export const createOrderGuest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerName, customerPhone, deliveryType, deliveryAddress, items, scheduledFor, paymentProvider } = req.body

    const order = await OrderModel.createOrderGuest({
      customerName,
      customerPhone,
      deliveryType,
      deliveryAddress,
      items,
      scheduledFor,
      paymentProvider
    })

    res.status(201).json({
      success: true,
      message: 'Pedido creado correctamente',
      data: order
    })
  } catch (error) {
    next(error)
  }
}

export const payOrderStripe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const order = await OrderModel.findOrderForStripe({ orderId: id, userId })

    if (!order) {
      throw new AppError('Pedido no encontrado', 404)
    }

    const session = await createStripeCheckoutSession(order)

    await PaymentModel.updateSession(order.id, session.id)

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
        checkoutUrl: session.url
      }
    })
  } catch (error) {
    next(error)
  }
}

export const payOrderGuestStripe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const order = await OrderModel.findOrderForStripe({ orderId: id })

    if (!order) {
      throw new AppError('Pedido no encontrado', 404)
    }

    const session = await createStripeCheckoutSession(order)

    await PaymentModel.updateSession(order.id, session.id)

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
        checkoutUrl: session.url
      }
    })
  } catch (error) {
    next(error)
  }
}

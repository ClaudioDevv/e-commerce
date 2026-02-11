import { Request, Response, NextFunction } from 'express'
import * as OrderModel from '../models/order'
import * as PaymentModel from '../models/payment'
import * as OrderService from '../services/orderService'
import { AppError } from '../utils/AppError'
import { stripe } from '../config/stripe'
import { createStripeCheckoutSession } from '../services/stripeService'
import Stripe from 'stripe'
import { logger } from '../config/logger'

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const role = req.user!.role

    const filters = {
      status: req.query.status as string | undefined,
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: 20
    }

    const result = await OrderModel.getAllOrders(userId, role, filters)

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

          logger.info('Refund processed successfully', {
            orderId: order.id,
            userId,
            refundId: refund.id,
            amount: refund.amount
          })

          refundProcessed = true
        } catch (error) {
          if (error instanceof Stripe.errors.StripeError) {
            logger.error('Stripe refund failed', {
              orderId: order.id,
              userId,
              stripeError: error.message,
              type: error.type
            })
          }
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

    const order = await OrderModel.findOrderForStripe(id, userId)

    if (!order) {
      throw new AppError('Pedido no encontrado', 404)
    }

    if (order.payment?.status === 'SUCCEEDED') {
      throw new AppError('Este pedido ya está pagado', 400)
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

    const order = await OrderModel.findOrderForStripe(id)

    if (!order) {
      throw new AppError('Pedido no encontrado', 404)
    }

    if (order.payment?.status === 'SUCCEEDED') {
      throw new AppError('Este pedido ya está pagado', 400)
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

export const getAvailableTimeSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await OrderModel.getSettings()

    if (!settings) {
      throw new AppError('Configuración del sistema no encontrada', 500)
    }

    if (settings.temporarilyClosed) {
      return res.status(200).json({
        success: true,
        data: {
          timeSlots: [],
          isOpen: false,
          message: settings.statusMessage || 'El negocio está temporalmente cerrado',
          nextAvailable: null,
          lastAvailable: null
        }
      })
    }

    // Obtener slots disponibles
    const timeSlots = await OrderService.getAvailableTimeSlots(settings)

    if (timeSlots.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          timeSlots: [],
          isOpen: false,
          message: 'No hay horarios disponibles para hoy',
          nextAvailable: null,
          lastAvailable: null
        }
      })
    }

    res.status(200).json({
      success: true,
      data: {
        timeSlots,
        isOpen: true,
        nextAvailable: timeSlots[0].time,
        lastAvailable: timeSlots[timeSlots.length - 1].time,
        totalSlots: timeSlots.length
      }
    })
  } catch (error) {
    next(error)
  }
}

export const checkIfOpen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await OrderModel.getSettings()

    if (!settings) {
      throw new AppError('Configuración del sistema no encontrada', 500)
    }

    if (settings.temporarilyClosed) {
      return res.status(200).json({
        success: true,
        data: {
          isOpen: false,
          message: settings.statusMessage || 'Temporalmente cerrado'
        }
      })
    }

    const isOpen = await OrderService.isBusinessOpenNow()

    res.status(200).json({
      success: true,
      data: {
        isOpen,
        message: isOpen ? 'Abierto ahora' : 'Cerrado ahora'
      }
    })
  } catch (error) {
    next(error)
  }
}

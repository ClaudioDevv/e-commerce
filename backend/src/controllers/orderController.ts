import { Request, Response, NextFunction } from 'express'
import * as OrderModel from '../models/order'

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

    await OrderModel.cancelOrder(id, userId)

    // Reembolso con Stripe mas adelante

    res.status(200).json({
      success: true,
      message: 'Pedido cancelado correctamente'
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

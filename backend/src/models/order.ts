import { Decimal } from 'decimal.js'
import { AppError } from '../utils/AppError'
import { prisma } from '../lib/prisma'
import { logger } from '../config/logger'
import { OrderGuestInput, OrderUserInput } from '../validators/orderValidator'
import { getCartByUserId, deleteCart } from './cart'
import { getAddressById } from './address'
import { findUserById } from './user'
import * as OrderService from '../services/orderService'

// Interfaz para filtros
interface OrderFilters {
  status?: string
  dateFrom?: string
  dateTo?: string
  page: number
  limit: number
}

export const getSettings = async () => {
  return await prisma.settings.findFirst()
}

export const findOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: { payment: true }
  })
}

export const findOrderForStripe = async (orderId: string, userId?: string) => {
  const where = userId
    ? { id: orderId, userId }
    : { id: orderId, isGuest: true }

  return prisma.order.findUnique({
    where,
    select: {
      id: true,
      userId: true,
      status: true,
      total: true,
      deliveryFee: true,
      payment: {
        select: {
          provider: true,
          status: true
        }
      },
      items: {
        select: {
          nameSnapshot: true,
          unitPrice: true,
          quantity: true
        }
      }
    }
  })
}

export const getAllOrders = async (userId: string, role: string, filters: OrderFilters) => {
  const { status, dateFrom, dateTo, page, limit } = filters

  const where: any = {}

  if (role === 'CUSTOMER') {
    where.userId = userId
  }
  // Construimos el where dinámicamente para aplicar los filtros

  if (status) {
    where.status = status
  }

  if (dateFrom || dateTo) {
    where.createdAt = {}
    if (dateFrom) {
      where.createdAt.gte = new Date(dateFrom)
    }
    if (dateTo) {
      where.createdAt.lte = new Date(dateTo)
    }
  }

  // Calcular skip y take para paginación
  const skip = (page - 1) * limit
  const take = limit

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            customizations: {
              include: {
                customizable: true
              }
            }
          }
        },
        payment: true,
        address: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    }),
    prisma.order.count({ where })
  ])

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalpages: Math.ceil(total / limit)
    }
  }
}

export const getOrderById = async (id: string, userId: string, role: string) => {
  // Construir where según el rol
  const where: any = { id }

  if (role === 'CUSTOMER') {
    where.userId = userId
  }

  const order = await prisma.order.findUnique({
    where,
    include: {
      items: {
        include: {
          product: true,
          variant: true,
          customizations: {
            include: {
              customizable: true
            }
          }
        }
      },
      payment: true,
      address: true
    }
  })

  if (!order) {
    throw new AppError('Pedido no encontrado', 404)
  }

  return order
}

export const cancelOrder = async (id: string, userId: string) => {
  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: {
      payment: true
    }
  })

  if (!order) {
    throw new AppError('Pedido no encontrado', 400)
  }

  if (order.status === 'CANCELLED') {
    throw new AppError('El pedido ya está cancelado', 400)
  }

  if (!['PENDING', 'PAID'].includes(order.status)) {
    throw new AppError('No se puede cancelar un pedido en este estado', 400)
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: 'CANCELLED' }
  })

  logger.info('Order cancelled', {
    orderId: id,
    userId,
    previousStatus: order.status,
    paymentStatus: order.payment?.status
  })

  return {
    order: updatedOrder,
    payment: order.payment
  }
}

export const expireOrder = async (orderId: string) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' }
  })
}

export const createOrderGuest = async (data: OrderGuestInput['body']) => {
  // Comprobar que esta abierto el establecimiento
  const settings = await prisma.settings.findFirst()
  if (!settings) {
    throw new AppError('Configuración del sistema no encontrada', 500)
  }

  await OrderService.checkBusinessStatus(settings)

  // Enriquecer y validar datos
  const enrichedItems = await OrderService.enrichAndValidateGuestItems(data.items)

  const { itemsWithPrices, subtotal } = OrderService.calculateSubtotal(enrichedItems)

  // Calcular deliveryFee y validar direccion
  let deliveryAddress = null
  let deliveryFee = new Decimal(0)

  if (data.deliveryType === 'DELIVERY') {
    if (!data.deliveryAddress) {
      throw new AppError('deliveryAddress es requerido para entregas a domicilio', 400)
    }
    deliveryAddress = data.deliveryAddress
    deliveryFee = settings.deliveryFee
  }

  const total = subtotal.add(deliveryFee)

  // Validar Horarios si está programado
  if (data.scheduledFor) {
    await OrderService.validateScheduledTime(new Date(data.scheduledFor), settings)
  }

  // Calcular tiempo estimado
  const estimatedTime = await OrderService.calculateEstimatedTime(
    settings,
    data.scheduledFor ? new Date(data.scheduledFor) : undefined
  )

  // Crear pedido en transacción
  const order = await prisma.$transaction(async (tx) => {
    // Crear Order
    const newOrder = await tx.order.create({
      data: {
        userId: null,
        isGuest: true,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        deliveryType: data.deliveryType,
        addressId: null,
        deliveryStreet: deliveryAddress?.street,
        deliveryCity: deliveryAddress?.city,
        deliveryPostalCode: deliveryAddress?.postalCode,
        deliveryInstructions: deliveryAddress?.instructions,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
        estimatedTime,
        subtotal,
        deliveryFee,
        total,
        status: 'PENDING'
      }
    })

    // Crear OrderItems
    for (const item of itemsWithPrices) {
      const orderItem = await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          variantId: item.variantId,
          nameSnapshot: item.product.name,
          variantSnapshot: item.variant?.name,
          notesSnapshot: item.notes,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.itemSubtotal
        }
      })

      // Crear OrderItemCustomization
      if (item.customizations.length > 0) {
        await tx.orderItemCustomization.createMany({
          data: item.customizations.map(c => ({
            orderItemId: orderItem.id,
            customizableId: c.customizableId,
            action: c.action,
            nameSnapshot: c.customizable.name,
            priceSnapshot: c.customizable.extraPrice
          }))
        })
      }
    }

    // Crear Pago
    await tx.payment.create({
      data: {
        orderId: newOrder.id,
        provider: data.paymentProvider,
        amount: parseFloat(total.toString()),
        status: 'PENDING'
      }
    })

    return newOrder
  })

  logger.info('Guest Order created', {
    orderId: order.id,
    total: order.total.toString(),
    deliveryType: order.deliveryType,
    customerPhone: order.customerPhone
  })

  // Devolver Pedido completo
  const fullOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      items: {
        include: {
          customizations: {
            select: {
              nameSnapshot: true,
              priceSnapshot: true,
              action: true
            }
          }
        }
      },
      payment: true
    }
  })

  return fullOrder
}

export const createOrderUserLogged = async (userId: string, data: OrderUserInput['body']) => {
  // Comprobar que esta abierto el establecimiento
  const settings = await prisma.settings.findFirst()
  if (!settings) {
    throw new AppError('Configuración del sistema no encontrada', 500)
  }

  await OrderService.checkBusinessStatus(settings)

  // Obtener usuario
  const user = await findUserById(userId)
  if (!user) {
    throw new AppError('Usuario no encontrado', 404)
  }

  // Obtener carrito
  const cartItems = await getCartByUserId(userId)
  if (!cartItems || cartItems.length === 0) {
    throw new AppError('El carrito está vacío', 400)
  }

  // Validar productos
  await OrderService.validateCartItems(cartItems)

  // Calcular subtotal
  const { itemsWithPrices, subtotal } = OrderService.calculateSubtotal(cartItems)

  // Manejar direccion y calcular deliveryFee
  let address = null
  let deliveryFee = new Decimal(0)

  if (data.deliveryType === 'DELIVERY') {
    if (!data.addressId) {
      throw new AppError('AddressId requerdiro para entregas a domicilio', 400)
    }

    address = await getAddressById(data.addressId, userId)
    deliveryFee = settings.deliveryFee
  }

  const total = subtotal.add(deliveryFee)

  // Validar horario si esta programado
  if (data.scheduledFor) {
    await OrderService.validateScheduledTime(new Date(data.scheduledFor), settings)
  }

  // Calcular tiempo estimado
  const estimatedTime = await OrderService.calculateEstimatedTime(
    settings,
    data.scheduledFor ? new Date(data.scheduledFor) : undefined
  )

  // Crear pedido en transacción
  const order = await prisma.$transaction(async (tx) => {
    // Crear Pedido
    const newOrder = await tx.order.create({
      data: {
        userId,
        isGuest: false,
        customerName: `${user.name} ${user.surname}`,
        customerPhone: user.phone,
        deliveryType: data.deliveryType,
        addressId: address?.id,
        deliveryStreet: address?.street,
        deliveryCity: address?.city,
        deliveryInstructions: address?.instructions,
        deliveryPostalCode: address?.postalCode,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
        estimatedTime,
        subtotal,
        deliveryFee,
        total,
        status: 'PENDING'
      }
    })

    // Crear OrderItems
    for (const item of itemsWithPrices) {
      const orderItem = await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          variantId: item.variantId,
          nameSnapshot: item.product.name,
          variantSnapshot: item.variant?.name,
          notesSnapshot: item.notes,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.itemSubtotal

        }
      })

      // Crear OrderItemCustomizations
      if (item.customizations.length > 0) {
        await tx.orderItemCustomization.createMany({
          data: item.customizations.map(c => ({
            orderItemId: orderItem.id,
            customizableId: c.customizableId,
            action: c.action,
            nameSnapshot: c.customizable.name,
            priceSnapshot: c.customizable.extraPrice
          }))
        })
      }
    }

    // Crear pago
    await tx.payment.create({
      data: {
        orderId: newOrder.id,
        provider: data.paymentProvider,
        amount: parseFloat(total.toString()),
        status: 'PENDING'
      }
    })

    // Vaciar carrito
    await deleteCart(userId)

    return newOrder
  })

  logger.info('User Order created', {
    orderId: order.id,
    userId: order.userId,
    total: order.total.toString(),
    deliveryType: order.deliveryType,
  })

  // Devolver pedido completo
  const fullOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      items: {
        include: {
          customizations: {
            select: {
              nameSnapshot: true,
              priceSnapshot: true,
              action: true
            }
          }
        }
      },
      payment: true,
      address: true
    }
  })

  return fullOrder
}

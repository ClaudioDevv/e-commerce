import { Decimal } from 'decimal.js'
import { enrichAndValidateGuestItems, validateProducts } from '../services/orderService'
import { AppError } from '../utils/AppError'
import { calculateCartItemPrice } from '../utils/priceCalculator'
import { OrderGuestInput, OrderUserInput } from '../validators/orderValidator'
import { getAddressById } from './address'
import { deleteCart, getCartByUserId } from './cart'
import { findUserById } from './user'
import { prisma } from '../lib/prisma'

// Interfaz para filtros
interface OrderFilters {
  status?: string
  dateFrom?: string
  dateTo?: string
  page: number
  limit: number
}

export const findOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: { payment: true }
  })
}

type FindOrderForStripeParams = {
  orderId: string
  userId?: string
}

export const findOrderForStripe = async ({ orderId, userId }: FindOrderForStripeParams) => {
  const where = userId
    ? { id: orderId, userId }
    : { id: orderId, isGuest: true }

  return prisma.order.findUnique({
    where,
    select: {
      id: true,
      userId: true,
      status: true,
      deliveryFee: true,
      payment: {
        select: {
          provider: true
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
export const findGuestOrder = async (id: string) => {
  return prisma.order.findUnique({
    where: {
      id,
      isGuest: true
    },
    include: {
      items: true,
      payment: true,
      address: true
    }
  })
}

export const getAllOrders = async (userId: string, filters: OrderFilters) => {
  const { status, dateFrom, dateTo, page, limit } = filters

  // Construimos el where dinámicamente para aplicar los filtros
  const where: any = { userId }

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
            customIngredients: {
              include: {
                ingredient: true
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
          customIngredients: {
            include: {
              ingredient: true
            }
          }
        }
      },
      payment: true,
      address: true
    }
  })

  if (!order) {
    throw new AppError('Pedido no existe', 404)
  }

  return order
}

export const cancelOrder = async (id: string, userId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id,
      userId,
    },
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
  // Enriquecer datos
  const enrichedItems = await enrichAndValidateGuestItems(data.items)

  // Obtener configuración
  const settings = await prisma.settings.findFirst()
  if (!settings) {
    throw new AppError('Configuración del sistema no encontrada', 500)
  }

  // Calcular subtotal
  let subtotal = new Decimal(0)

  const itemsWithPrices = enrichedItems.map(item => {
    const addedIngredients = item.customIngredients
      .filter(ci => ci.action === 'ADD')
      .map(ci => ci.ingredient)

    const unitPrice = calculateCartItemPrice(
      item.product,
      item.variant,
      addedIngredients
    )

    const itemSubtotal = unitPrice.mul(item.quantity)
    subtotal = subtotal.add(itemSubtotal)

    return {
      ...item,
      unitPrice,
      itemSubtotal
    }
  })

  // Direccion y deliveryFee
  let deliveryFee = new Decimal(0)
  let deliveryAddress = null

  if (data.deliveryType === 'DELIVERY') {
    if (!data.deliveryAddress) {
      throw new AppError('deliveryAddress es requerido para entregas a domicilio', 400)
    }
    deliveryAddress = data.deliveryAddress
    deliveryFee = settings.deliveryFee
  }

  const total = subtotal.add(deliveryFee)

  // 7. Validar Horarios
  if (data.scheduledFor) {
    const scheduledDate = new Date(data.scheduledFor)
    const now = new Date()

    if (scheduledDate <= now) {
      throw new AppError('La fecha programada debe ser futura', 400)
    }
  }

  // Calcular tiempo estimado
  let estimatedTime = null
  if (data.scheduledFor) {
    estimatedTime = new Date(data.scheduledFor)
  } else {
    const now = new Date()
    estimatedTime = new Date(now.getTime() + settings.avgPrepMinutes * 60000)
  }

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

      // Crear OrderItemIngredients
      if (item.customIngredients.length > 0) {
        for (const ci of item.customIngredients) {
          await tx.orderItemIngredient.create({
            data: {
              orderItemId: orderItem.id,
              ingredientId: ci.ingredientId,
              action: ci.action,
              priceSnapshot: ci.ingredient.extraPrice
            }
          })
        }
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

    // No hay carrito que vaciar

    return newOrder
  })

  // Devolver Pedido completo
  const fullOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      items: {
        include: {
          customIngredients: {
            include: {
              ingredient: true
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
  await validateProducts(cartItems)

  // 4. Obtener configuración de la pizzería
  const settings = await prisma.settings.findFirst()
  if (!settings) {
    throw new AppError('Configuración del sistema no encontrada', 500)
  }

  // Calcular subtotal
  let subtotal = new Decimal(0)

  const itemsWithPrices = cartItems.map(item => {
    const addedIngredients = item.customIngredients
      .filter(ci => ci.action === 'ADD')
      .map(ci => ci.ingredient)

    const unitPrice = calculateCartItemPrice(
      item.product,
      item.variant,
      addedIngredients
    )

    const itemSubtotal = unitPrice.mul(item.quantity)
    subtotal = subtotal.add(itemSubtotal)

    return {
      ...item,
      unitPrice,
      itemSubtotal
    }
  })

  // Manejar direccion y calcualr deliveryFee

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

  // Validar Fecha
  if (data.scheduledFor) {
    const scheduledDate = new Date(data.scheduledFor)
    const now = new Date()

    if (scheduledDate <= now) {
      throw new AppError('La fecha programada debe ser futura', 400)
    }

    // TODO: validar horarios de apertura
  }

  // Calcular estimatedTime
  let estimatedTime = null
  if (data.scheduledFor) {
    estimatedTime = new Date(data.scheduledFor)
  } else {
    const now = new Date()
    estimatedTime = new Date(now.getTime() + settings.avgPrepMinutes * 60000)
  }

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
          notesSnapshot: item?.notes,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.itemSubtotal

        }
      })

      // Crear OrderItemIngredients
      if (item.customIngredients.length > 0) {
        for (const ci of item.customIngredients) {
          await tx.orderItemIngredient.create({
            data: {
              orderItemId: orderItem.id,
              ingredientId: ci.ingredientId,
              action: ci.action,
              priceSnapshot: ci.ingredient.extraPrice
            }
          })
        }
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

  // Devolver pedido completo
  const fullOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      items: {
        include: {
          customIngredients: {
            include: {
              ingredient: true
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

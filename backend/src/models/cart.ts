import { Decimal } from 'decimal.js'
import { AppError } from '../utils/AppError'
import { calculateCartItemPrice } from '../utils/priceCalculator'
import { CartItemInput, UpdateCartItemInput } from '../validators/cartValidator'
import { prisma } from '../lib/prisma'
import * as CartService from '../services/cartService'

const MAX_QUANTITY_PER_ITEM = 15

export const getCartByUserId = async (userId: string) => {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: true,
      variant: true,
      customizations: {
        include: {
          customizable: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export const addToCart = async (userId: string, data: CartItemInput['body']) => {
  // Normalizar customizaciones
  const customizations = data.customizations ?? []

  // Validar producto
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
    include: {
      variants: { where: { active: true } },
      baseCustomizables: true,
      availableCustomizables: true
    }
  })

  if (!product || !product.active) throw new AppError('Producto no disponible', 404)

  // Validar variante
  const validatedVariantId = CartService.validateVariant(product.variants, data.variantId)

  // Validar personalización
  await CartService.validateCustomizations(product, customizations)

  // Buscar item idéntico existente
  const existingItem = await CartService.findIdenticalCartItem(userId, data.productId, validatedVariantId, customizations)

  // Actualizar item o crear si no existe
  if (existingItem) {
    const newQuantity = existingItem.quantity + data.quantity

    if (newQuantity > MAX_QUANTITY_PER_ITEM) {
      throw new AppError(`La cantidad máxima por producto es ${MAX_QUANTITY_PER_ITEM}`, 400)
    }

    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: newQuantity
      },
      include: {
        product: true,
        variant: true,
        customizations: {
          include: { customizable: true }
        }
      }
    })
  }

  // Crear nuevo Item
  return await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.create({
      data: {
        userId,
        productId: data.productId,
        variantId: validatedVariantId,
        quantity: data.quantity,
        notes: data.notes || null
      }
    })

    if (customizations.length > 0) {
      await tx.cartItemCustomization.createMany({
        data: customizations.map(c => ({
          cartItemId: cartItem.id,
          customizableId: c.customizableId,
          action: c.action
        }))
      })
    }

    return await tx.cartItem.findUnique({
      where: { id: cartItem.id },
      include: {
        product: true,
        variant: true,
        customizations: {
          include: { customizable: true }
        }
      }
    })
  })
}

export const updateCartItem = async (userId: string, cartItemId: string, data: UpdateCartItemInput['body']) => {
  // Normalizar customizations
  const customizations = data.customizations

  // Comprobar que el item existe y pertenece al usuario
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      userId
    },
    include: {
      product: {
        include: {
          baseCustomizables: true,
          availableCustomizables: true
        }
      }
    }
  })

  if (!existingItem) {
    throw new AppError('Item no encontrado', 404)
  }

  if (!existingItem.product.active) {
    throw new AppError('Este producto ya no está disponible', 400)
  }

  // Validar customizaciones si se actualizan
  if (data.quantity !== undefined) {
    if (data.quantity > MAX_QUANTITY_PER_ITEM) {
      throw new AppError(`La cantidad máxima por producto es ${MAX_QUANTITY_PER_ITEM}`, 400)
    }
  }

  if (customizations !== undefined) {
    await CartService.validateCustomizations(existingItem.product, customizations)
  }

  // Actualizar item
  return await prisma.$transaction(async (tx) => {
    if (customizations !== undefined) {
      await tx.cartItemCustomization.deleteMany({
        where: { cartItemId }
      })

      // Crear nuevos ingredientes personalizados
      if (customizations.length > 0) {
        await tx.cartItemCustomization.createMany({
          data: customizations.map(c => ({
            cartItemId,
            customizableId: c.customizableId,
            action: c.action
          }))
        })
      }
    }

    // Actualizar CartItem
    return await tx.cartItem.update({
      where: { id: cartItemId },
      data: {
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.notes !== undefined && { notes: data.notes })
      },
      include: {
        product: true,
        variant: true,
        customizations: { include: { customizable: true } }
      }
    })
  })
}

export const deleteItemById = async (userId: string, cartItemId: string) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      userId
    }
  })

  if (!item) throw new AppError('Item no encontrado', 404)

  return await prisma.cartItem.delete({
    where: { id: cartItemId }
  })
}

export const deleteCart = async (userId: string) => {
  return await prisma.cartItem.deleteMany({
    where: { userId }
  })
}

export const getCartSummary = async (userId: string) => {
  const cart = await getCartToSummary(userId)

  let subtotal = new Decimal(0)
  let totalItems = 0

  for (const item of cart) {
    const addedCustomizables = item.customizations.map(c => c.customizable)

    const unitPrice = calculateCartItemPrice(
      item.product.basePrice,
      item.variant?.priceDelta,
      addedCustomizables
    )

    subtotal = subtotal.add(unitPrice.mul(item.quantity))
    totalItems += item.quantity
  }

  return {
    subtotal: subtotal.toString(),
    totalItems,
    itemsCount: cart.length
  }
}

export const getCartToSummary = async (userId: string) => {
  return await prisma.cartItem.findMany({
    where: { userId },
    select: {
      quantity: true,
      product: {
        select: {
          basePrice: true
        }
      },
      variant: {
        select: {
          priceDelta: true
        }
      },
      customizations: {
        where: { action: 'ADD' },
        select: {
          customizable: {
            select: {
              extraPrice: true
            }
          }
        }
      }
    }
  })
}

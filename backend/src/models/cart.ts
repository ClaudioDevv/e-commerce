import { Decimal } from '@prisma/client/runtime/library'
import { Ingredient, PrismaClient } from '../generated/prisma'
import { AppError } from '../utils/AppError'
import { calculateCartItemPrice } from '../utils/priceCalculator'
import { CartItemInput, UpdateCartItemInput } from '../validators/cartValidator'

const prisma = new PrismaClient()

export const getCartByUserId = async (userId: string) => {
  const cart = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: true,
      variant: true,
      customIngredients: {
        include: {
          ingredient: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return cart
}

export const addToCart = async (userId: string, data: CartItemInput['body']) => {
  // Validar producto
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
    include: {
      variants: { where: { active: true } },
      pizzaConfig: {
        include: {
          baseIngredients: {
            include: { ingredient: true }
          }
        }
      }
    }
  })

  if (!product || !product.active) throw new AppError('Producto no disponible', 404)

  // Validar variante
  let selectedVariant = null

  if (data.variantId) {
    selectedVariant = product.variants.find(v => v.id === data.variantId)
    if (!selectedVariant) {
      throw new AppError('Tamaño no válido para este producto', 400)
    }
  } else {
    if (product.variants.length > 0) {
      throw new AppError('Debes seleccionar un tamaño', 400)
    }
  }

  // Validar ingredeintes personalizados
  let validateIngredients: Ingredient[] = []

  if (data.customIngredients && data.customIngredients.length > 0) {
    if (product.category !== 'PIZZA') {
      throw new AppError('Este producto no permite personalización', 400)
    }

    if (!product.pizzaConfig || !product.pizzaConfig.allowCustomization) {
      throw new AppError('Este producto no permite personalización', 400)
    }

    const ingredientsIds = data.customIngredients.map(ci => ci.ingredientId)

    validateIngredients = await prisma.ingredient.findMany({
      where: {
        id: {
          in: ingredientsIds
        },
        available: true
      }
    })

    if (validateIngredients.length !== ingredientsIds.length) throw new AppError('Algún ingrediente no está disponible', 400)
  }

  // Comprobar si existe item identico
  const existingItems = await prisma.cartItem.findMany({
    where: {
      productId: product.id,
      userId,
      variantId: data.variantId || null
    },
    include: {
      customIngredients: true
    }
  })

  let existingItem = null
  if (!data.customIngredients || data.customIngredients.length === 0) {
    existingItem = existingItems.find(item => item.customIngredients.length === 0)
  } else {
    for (const item of existingItems) {
      if (item.customIngredients.length !== data.customIngredients.length) {
        continue
      }

      const allMatch = data.customIngredients.every(ci => {
        return item.customIngredients.some(ici =>
          ici.ingredientId === ci.ingredientId && ici.action === ci.action
        )
      })

      if (allMatch) {
        existingItem = item
        break
      }
    }
  }

  // Actualizar o crear item
  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + data.quantity
      },
      include: {
        product: true,
        variant: true,
        customIngredients: {
          include: { ingredient: true }
        }
      }
    })
  }

  return await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.create({
      data: {
        userId,
        productId: data.productId,
        variantId: data.variantId || null,
        quantity: data.quantity,
        notes: data.notes || null
      }
    })

    if (data.customIngredients && data.customIngredients.length > 0) {
      await tx.cartItemIngredient.createMany({
        data: data.customIngredients.map(ci => ({
          cartItemId: cartItem.id,
          ingredientId: ci.ingredientId,
          action: ci.action
        }))
      })

      return await tx.cartItem.findUnique({
        where: { id: cartItem.id },
        include: {
          product: true,
          variant: true,
          customIngredients: {
            include: { ingredient: true }
          }
        }
      })
    }
  })
}

export const updateCartItem = async (userId: string, cartItemId: string, data: UpdateCartItemInput['body']) => {
  // Comprobar que el item existe y pertenece al usuario
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      userId
    },
    include: {
      product: {
        include: {
          pizzaConfig: true
        }
      }
    }
  })

  if (!existingItem) {
    throw new AppError('Item no encontrado o no pertenece al usuario', 404)
  }

  // Validar ingredientes personalizados
  if (data.customIngredients && data.customIngredients.length > 0) {
    if (existingItem.product.category !== 'PIZZA') {
      throw new AppError('Este producto no permite personalización', 400)
    }

    if (!existingItem.product.pizzaConfig?.allowCustomization) {
      throw new AppError('Esta pizza no permite personalización', 400)
    }

    const ingredientIds = data.customIngredients.map(ci => ci.ingredientId)

    const ingredients = await prisma.ingredient.findMany({
      where: {
        id: { in: ingredientIds },
        available: true
      }
    })

    if (ingredients.length !== ingredientIds.length) {
      throw new AppError('Algún ingrediente no está disponible', 400)
    }
  }

  // Actualizar item
  return await prisma.$transaction(async (tx) => {
    if (data.customIngredients !== undefined) {
      await tx.cartItemIngredient.deleteMany({
        where: { cartItemId }
      })

      // Crear nuevos ingredientes personalizados
      if (data.customIngredients.length > 0) {
        await tx.cartItemIngredient.createMany({
          data: data.customIngredients.map(ci => ({
            cartItemId,
            ingredientId: ci.ingredientId,
            action: ci.action
          }))
        })
      }
    }

    // Actualizar CartItem
    const updatedItem = await tx.cartItem.update({
      where: { id: cartItemId },
      data: {
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.notes !== undefined && { notes: data.notes })
      },
      include: {
        product: true,
        variant: true,
        customIngredients: {
          include: { ingredient: true }
        }
      }
    })

    return updatedItem
  })
}

export const deleteItemById = async (userId: string, cartItemId: string) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      userId
    }
  })

  if (!item) throw new AppError('Item no encontrado o no pertenece al usuario', 404)

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
  const cart = await getCartByUserId(userId)

  let subtotal = new Decimal(0)
  let totalItems = 0

  for (const item of cart) {
    const addedIngredients = item.customIngredients
      .filter(ci => ci.action === 'ADD')
      .map(ci => ci.ingredient)

    const unitPrice = calculateCartItemPrice(
      item.product,
      item.variant,
      addedIngredients
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

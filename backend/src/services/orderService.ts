import { CartItem, ProductVariant } from '../generated/prisma'
import { AppError } from '../utils/AppError'
import { prisma } from '../lib/prisma'

interface GuestOrderItem {
  productId: string
  variantId?: string
  quantity: number
  notes?: string
  customIngredients?: Array<{ ingredientId: number; action: 'ADD' | 'REMOVE' }>
}

export const validateProducts = async (items: (CartItem | GuestOrderItem)[]) => {
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
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

    if (!product || !product.active) {
      throw new AppError('Producto no disponible', 404)
    }

    // Validar Variante
    if (item.variantId) {
      const selectedVariant = product.variants.find(v => v.id === item.variantId)
      if (!selectedVariant) {
        throw new AppError(`Tamaño no válido para ${product.name}`, 400)
      }
    } else {
      if (product.variants.length > 0) {
        throw new AppError(`Debes seleccionar un tamaño para ${product.name}`, 400)
      }
    }

    // Validar ingredientes personalizados
    // Type Guard de Typescript
    const customIngredients = 'customIngredients' in item && item.customIngredients
      ? item.customIngredients
      : []

    if (customIngredients.length > 0) {
      if (product.category !== 'PIZZA') {
        throw new AppError(`${product.name} no permite personalización`, 400)
      }

      if (!product.pizzaConfig || !product.pizzaConfig.allowCustomization) {
        throw new AppError(`${product.name} no permite personalización`, 400)
      }

      // Validar que todos los ingredientes existen y están disponibles
      const ingredientsIds = customIngredients.map(ci => ci.ingredientId)

      const validateIngredients = await prisma.ingredient.findMany({
        where: {
          id: { in: ingredientsIds },
          available: true
        }
      })

      if (validateIngredients.length !== ingredientsIds.length) {
        throw new AppError(`Algún ingrediente seleccionado en ${product.name} no está disponible`, 400)
      }
    }
  }
}

export const enrichGuestItems = async (items: GuestOrderItem[]) => {
  const enrichedItems = []

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: {
        variants: true,
        pizzaConfig: {
          include: {
            baseIngredients: {
              include: { ingredient: true }
            }
          }
        }
      }
    })

    if (!product) {
      throw new AppError('Producto no encontrado', 404)
    }

    let variant: ProductVariant | null = null
    if (item.variantId) {
      variant = product.variants.find(v => v.id === item.variantId) || null
    }

    // Enriquecer ingredientes personalizados con datos completos
    const enrichedCustomIngredients = []
    if (item.customIngredients) {
      for (const ci of item.customIngredients) {
        const ingredient = await prisma.ingredient.findUnique({
          where: { id: ci.ingredientId }
        })

        if (ingredient) {
          enrichedCustomIngredients.push({
            ingredientId: ci.ingredientId,
            ingredient,
            action: ci.action
          })
        }
      }
    }

    enrichedItems.push({
      productId: item.productId,
      product,
      variantId: item.variantId,
      variant,
      quantity: item.quantity,
      notes: item.notes,
      customIngredients: enrichedCustomIngredients
    })
  }

  return enrichedItems
}

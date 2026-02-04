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
  const productsIds: Set<string> = new Set()
  const ingredientsIds: Set<number> = new Set()

  items.forEach(item => {
    productsIds.add(item.productId)
    if ('customIngredients' in item && item.customIngredients) {
      item.customIngredients.forEach(ingredient => {
        ingredientsIds.add(ingredient.ingredientId)
      })
    }
  })

  const products = await prisma.product.findMany({
    where: { id: { in: [...productsIds] } },
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

  const ingredients = await prisma.ingredient.findMany({
    where: {
      id: { in: [...ingredientsIds] },
      available: true
    }
  })

  const availableIngredientIds = new Set(ingredients.map(ing => ing.id))

  for (const item of items) {
    const product = products.find(prod => prod.id === item.productId)

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
      const currentIngredientIds = customIngredients.map(ci => ci.ingredientId)

      const allIngredientsAvailable = currentIngredientIds.every(id =>
        availableIngredientIds.has(id)
      )

      if (!allIngredientsAvailable) {
        throw new AppError(`Algún ingrediente seleccionado en ${product.name} no está disponible`, 400)
      }
    }
  }
}

export const enrichAndValidateGuestItems = async (items: GuestOrderItem[]) => {
  const enrichedItems = []
  const productsIds: Set<string> = new Set()
  const ingredientsIds: Set<number> = new Set()

  items.forEach(item => {
    productsIds.add(item.productId)
    if ('customIngredients' in item && item.customIngredients) {
      item.customIngredients.forEach(ingredient => {
        ingredientsIds.add(ingredient.ingredientId)
      })
    }
  })

  const products = await prisma.product.findMany({
    where: { id: { in: [...productsIds] } },
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

  const ingredients = await prisma.ingredient.findMany({
    where: {
      id: { in: [...ingredientsIds] },
      available: true
    }
  })

  for (const item of items) {
    const product = products.find(prod => prod.id === item.productId)

    if (!product || !product.active) {
      throw new AppError('Producto no disponible', 404)
    }

    let variant: ProductVariant | null = null
    if (item.variantId) {
      variant = product.variants.find(v => v.id === item.variantId) || null
      if (!variant) {
        throw new AppError(`Tamaño no válido para ${product.name}`, 400)
      }
    } else {
      if (product.variants.length > 0) {
        throw new AppError(`Debes seleccionar un tamaño para ${product.name}`, 400)
      }
    }

    // Enriquecer ingredientes personalizados con datos completos
    const enrichedCustomIngredients = []
    if (item.customIngredients) {
      if (product.category !== 'PIZZA') {
        throw new AppError(`${product.name} no permite personalización`, 400)
      }

      if (!product.pizzaConfig || !product.pizzaConfig.allowCustomization) {
        throw new AppError(`${product.name} no permite personalización`, 400)
      }

      for (const ci of item.customIngredients) {
        const ingredient = ingredients.find(ig => ig.id === ci.ingredientId)

        if (ingredient) {
          enrichedCustomIngredients.push({
            ingredientId: ci.ingredientId,
            ingredient,
            action: ci.action
          })
        } else {
          throw new AppError(`Algún ingrediente seleccionado en ${product.name} no está disponible`, 400)
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

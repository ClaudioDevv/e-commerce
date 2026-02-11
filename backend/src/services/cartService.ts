import { AppError } from '../utils/AppError'
import { prisma } from '../lib/prisma'
import { Customizable, CustomizationAction, Product, ProductAvailableCustomizable, ProductBaseCustomizable, ProductVariant } from '../generated/prisma'

export interface CustomizationInput {
  customizableId: number
  action: CustomizationAction
}

export const validateCustomizations = async (
  product: Product & {
    baseCustomizables: ProductBaseCustomizable[]
    availableCustomizables: ProductAvailableCustomizable[]
  },
  customizations: CustomizationInput[]
): Promise<Customizable[]> => {
  if (!customizations || customizations.length === 0) {
    return []
  }

  if (!product.allowCustomization) {
    throw new AppError('Este producto no admite personalización', 400)
  }

  const customizableIds = customizations.map(c => c.customizableId)

  const uniqueIds = new Set(customizableIds)
  if (uniqueIds.size !== customizableIds.length) {
    throw new AppError('No se pueden enviar personalizaciones duplicadas', 400)
  }

  const customizables = await prisma.customizable.findMany({
    where: {
      id: { in: customizableIds },
      available: true
    }
  })

  if (customizables.length !== customizableIds.length) {
    throw new AppError('Alguna personalización no está disponible', 400)
  }

  for (const customization of customizations) {
    const customizable = customizables.find(c => c.id === customization.customizableId)

    if (customization.action === 'REMOVE') {
      // Debe estar en la base y ser removible
      const baseItem = product.baseCustomizables.find(
        bc => bc.customizableId === customization.customizableId
      )

      if (!baseItem) {
        throw new AppError(`No puedes quitar "${customizable?.name}" porque no viene incluido`, 400)
      }

      if (!baseItem.isRemovable) {
        throw new AppError(`No puedes quitar "${customizable?.name}" de este producto`, 400)
      }
    } else if (customization.action === 'ADD') {
      // Debe estar en los disponibles
      const isAvailable = product.availableCustomizables.some(
        ac => ac.customizableId === customization.customizableId
      )

      if (!isAvailable) {
        throw new AppError(`No puedes añadir "${customizable?.name}" a este producto`, 400)
      }
    }
  }

  return customizables
}

export const validateVariant = (variants: ProductVariant[], variantId?: string): string | null => {
  if (variantId) {
    const variant = variants.find(v => v.id === variantId && v.active)
    if (!variant) {
      throw new AppError('Variante no válida para este producto', 400)
    }
    return variantId
  }

  if (variants.length > 0) {
    throw new AppError('Debes seleccionar una variante', 400)
  }

  return null
}

export const areCustomizationsEqual = (
  customizations1: CustomizationInput[],
  customizations2: CustomizationInput[]
): boolean => {
  if (customizations1.length !== customizations2.length) {
    return false
  }

  const set1 = new Set(
    customizations1.map(c => `${c.customizableId}-${c.action}`)
  )
  const set2 = new Set(
    customizations2.map(c => `${c.customizableId}-${c.action}`)
  )

  if (set1.size !== set2.size) return false

  for (const item of set1) {
    if (!set2.has(item)) return false
  }

  return true
}

export const findIdenticalCartItem = async (userId: string, productId: string, variantId: string | null, customizations: CustomizationInput[]) => {
  if (customizations.length === 0) {
    return await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        variantId,
        customizations: { none: {} }
      }
    })
  }

  const existingItems = await prisma.cartItem.findMany({
    where: {
      userId,
      productId,
      variantId
    },
    include: {
      customizations: true
    }
  })

  for (const item of existingItems) {
    if (areCustomizationsEqual(customizations, item.customizations)) {
      return item
    }
  }

  return null
}

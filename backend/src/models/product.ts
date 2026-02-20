import { Category } from '../generated/prisma'
import { prisma } from '../lib/prisma'

export const getAll = async () => {
  return prisma.product.findMany({
    orderBy: { category: 'asc' }
  })
}

export const getByCategory = async (category: Category) => {
  return await prisma.product.findMany({
    where: {
      category,
      active: true
    },
    select: {
      id: true,
      name: true,
      description: true,
      basePrice: true,
      imageUrl: true,
      subcategory: true,
      allowCustomization: true,
      variants: {
        where: { active: true },
        orderBy: { priceDelta: 'asc' },
        select: {
          id: true,
          name: true,
          priceDelta: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })
}

export const getBySubcategory = async (category: Category, subcategory: string) => {
  return await prisma.product.findMany({
    where: {
      category,
      subcategory,
      active: true
    },
    select: {
      id: true,
      name: true,
      description: true,
      basePrice: true,
      imageUrl: true,
      subcategory: true,
      allowCustomization: true,
      variants: {
        where: { active: true },
        orderBy: { priceDelta: 'asc' },
        select: {
          id: true,
          name: true,
          priceDelta: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })
}

export const getById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        where: { active: true },
        orderBy: { priceDelta: 'asc' }
      },
      baseCustomizables: {
        include: { customizable: true },
        orderBy: { customizable: { name: 'asc' } }
      },
      availableCustomizables: {
        include: { customizable: true },
        orderBy: { customizable: { category: 'asc' } }
      }
    }
  })
}

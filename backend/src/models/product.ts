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
    include: {
      variants: {
        where: { active: true },
        orderBy: { priceDelta: 'asc' }
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

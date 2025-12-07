import { prisma } from '../lib/prisma'

export const getAllIngredients = async () => {
  return prisma.ingredient.findMany({
    orderBy: { name: 'asc' }
  })
}

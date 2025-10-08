import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

export const getAllIngredients = async () => {
  return prisma.ingredient.findMany({
    orderBy: { name: 'asc' }
  })
}

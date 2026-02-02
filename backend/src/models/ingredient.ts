import { prisma } from '../lib/prisma'

export const getAll = async () => {
  return prisma.ingredient.findMany({
    orderBy: { name: 'asc' }
  })
}

import { PrismaClient, Category } from '../generated/prisma'

const prisma = new PrismaClient()

export const getAll = async () => {
  return prisma.product.findMany({
    orderBy: { category: 'asc' }
  })
}

export const getByCategory = async (category: Category) => {
  return prisma.product.findMany({
    where: { category },
    orderBy: { name: 'asc' }
  })
}

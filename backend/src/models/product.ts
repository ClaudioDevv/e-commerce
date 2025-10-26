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

export const getById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
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
}

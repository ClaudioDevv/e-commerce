import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

export const getAllPizzas = async () => {
  return prisma.pizza.findMany({
    orderBy: { name: 'asc' }
  })
}

export const getPizzaById = async (id: number) => {
  return prisma.pizza.findUnique({
    where: { id }
  })
}

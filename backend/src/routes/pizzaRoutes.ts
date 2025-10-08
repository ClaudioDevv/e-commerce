import { Router } from 'express'
import { PrismaClient } from '../generated/prisma'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const pizzas = await prisma.pizza.findMany()
  res.json(pizzas)
})

router.post('/', async (req, res) => {
  try {
    const { name, description, basePrice, size, ingredientIds } = req.body

    const newPizza = await prisma.pizza.create({
      data: {
        name,
        description,
        basePrice,
        size,
        ingredients: {
          create: ingredientIds.map((ingredientId: number) => ({
            ingredient: { connect: { id: ingredientId } },
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true, // para devolver los datos del ingrediente
          },
        },
      },
    })

    res.status(201).json(newPizza)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'error interno' })
  }
})

export default router

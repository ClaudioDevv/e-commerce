import { Request, Response } from 'express'
import * as pizzaModel from '../models/pizza'

export const getPizzas = async (req: Request, res: Response) => {
  try {
    const pizzas = await pizzaModel.getAllPizzas()
    res.json(pizzas)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener pizzas' })
  }
}

export const getPizzaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const pizza = await pizzaModel.getPizzaById(Number(id))

    if (!pizza) {
      return res.status(404).json({ message: 'Pizza no encontrada' })
    }

    res.json(pizza)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener la pizza' })
  }
}

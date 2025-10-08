import { Request, Response } from 'express'
import * as ingredientModel from '../models/ingredient'

export const getIngredients = async (req: Request, res: Response) => {
  try {
    const ingredients = await ingredientModel.getAllIngredients()
    res.json(ingredients)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener ingredientes' })
  }
}

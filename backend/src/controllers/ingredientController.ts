import { Request, Response, NextFunction } from 'express'
import * as IngredientModel from '../models/ingredient'

export const getIngredients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ingredients = await IngredientModel.getAll()
    res.status(200).json({
      success: true,
      data: ingredients
    })
  } catch (error: any) {
    next(error)
  }
}

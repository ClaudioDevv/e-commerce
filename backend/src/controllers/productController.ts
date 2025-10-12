import { Request, Response } from 'express'
import * as productModel from '../models/product'
import { Category } from '../generated/prisma'

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.getAll()
    res.json(products)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category: catParam } = req.params
    const upperCat = catParam.toUpperCase()

    // Validación: comprobar que la string recibida es un valor del enum
    const validValues = Object.values(Category) as string[]
    if (!validValues.includes(upperCat)) {
      return res.status(400).json({ message: 'Categoría inválida.' })
    }

    const category = upperCat as Category

    const products = await productModel.getByCategory(category)
    res.json(products)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener los productos por categoría' })
  }
}

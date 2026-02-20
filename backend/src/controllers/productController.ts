import { Request, Response, NextFunction } from 'express'
import * as ProductModel from '../models/product'
import { Category } from '../generated/prisma'
import { AppError } from '../utils/AppError'

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ProductModel.getAll()
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    })
  } catch (error) {
    next(error)
  }
}

export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category: catParam } = req.params
    const upperCat = catParam.toUpperCase()

    // Validación: comprobar que la string recibida es un valor del enum
    const validValues = Object.values(Category) as string[]
    if (!validValues.includes(upperCat)) {
      throw new AppError('Categoría no existente', 400)
    }

    const category = upperCat as Category

    const products = await ProductModel.getByCategory(category)
    res.status(200).json({
      success: true,
      data: products
    })
  } catch (error) {
    next(error)
  }
}

export const getProductsBySubcategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category: catParam, subcategory: subcatParam } = req.params
    const upperCat = catParam.toUpperCase()
    const upperSubcat = subcatParam.toUpperCase()

    // Validación: comprobar que la string recibida es un valor del enum
    const validValues = Object.values(Category) as string[]
    if (!validValues.includes(upperCat)) {
      throw new AppError('Categoría no existente', 400)
    }

    const category = upperCat as Category

    const products = await ProductModel.getBySubcategory(category, upperSubcat)

    if (products.length === 0) throw new AppError('No existen productos con esa subcategoría', 400)

    res.status(200).json({
      success: true,
      data: products
    })
  } catch (error) {
    next(error)
  }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const product = await ProductModel.getById(id)

    if (!product) {
      throw new AppError('Producto no encontrado', 404)
    }

    res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    next(error)
  }
}

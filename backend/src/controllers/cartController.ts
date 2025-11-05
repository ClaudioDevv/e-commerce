import { Request, Response, NextFunction } from 'express'
import * as CartModel from '../models/cart'

export const getAllCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const cart = await CartModel.getCartByUserId(userId)

    res.status(200).json({
      success: true,
      data: cart
    })
  } catch (error) {
    next(error)
  }
}

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { productId, variantId, quantity, notes, customIngredients } = req.body

    const cartItem = await CartModel.addToCart(userId, {
      productId,
      variantId,
      quantity,
      notes,
      customIngredients
    })

    res.status(201).json({
      success: true,
      data: cartItem
    })
  } catch (error) {
    next(error)
  }
}

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const { quantity, notes, customIngredients } = req.body

    const cartItem = await CartModel.updateCartItem(userId, id, {
      quantity,
      notes,
      customIngredients
    })

    res.status(200).json({
      success: true,
      message: 'Carrito actualizado',
      data: cartItem
    })
  } catch (error) {
    next(error)
  }
}

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    await CartModel.deleteItemById(userId, id)

    res.status(200).json({
      success: true,
      message: 'Producto borrado con éxito'
    })
  } catch (error) {
    next(error)
  }
}

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id

    await CartModel.deleteCart(userId)

    res.status(200).json({
      success: true,
      message: 'Carrito borrado con éxito'
    })
  } catch (error) {
    next(error)
  }
}

export const getSummary = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const userId = req.user!.id
    const summary = await CartModel.getCartSummary(userId)

    res.status(200).json({
      success: true,
      data: summary
    })
  } catch (error) {
    next(error)
  }
}

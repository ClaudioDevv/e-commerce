import { Request, Response, NextFunction } from 'express'
import * as addressModel from '../models/address'
import { AppError } from '../utils/AppError'

export const getAllAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const addresses = await addressModel.getAll(userId)

    res.status(200).json({
      success: true,
      data: addresses,
      count: addresses.length
    })
  } catch (e) {
    next(e)
  }
}

export const getAddressById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const address = await addressModel.getAddressById(id, userId)

    if (!address) {
      throw new AppError('Dirección no encontrada', 404)
    }

    res.status(200).json({
      success: true,
      data: address
    })
  } catch (e) {
    next(e)
  }
}

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { label, street, city, postalCode, province, instructions, isDefault } = req.body

    const address = await addressModel.createAddress({ userId, label, street, city, postalCode, province, instructions, isDefault: isDefault || false })

    res.status(201).json({
      success: true,
      message: 'Dirección creada exitosamente',
      data: address
    })
  } catch (e) {
    next(e)
  }
}

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const { label, street, city, postalCode, province, instructions } = req.body

    const address = await addressModel.updateAddress(id, userId, {
      label,
      street,
      city,
      postalCode,
      province,
      instructions
    })

    res.status(200).json({
      success: true,
      message: 'Dirección actualizada exitosamente',
      data: address
    })
  } catch (error) {
    next(error)
  }
}

export const deleteAddressById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    await addressModel.deleteAddress(id, userId)

    res.status(200).json({
      success: true,
      message: 'Dirección eliminada exitosamente'
    })
  } catch (e) {
    next(e)
  }
}

export const setDefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const defaultAddress = await addressModel.defaultAddress(id, userId)

    res.status(200).json({
      success: true,
      message: 'Dirección marcada como predeterminada',
      data: defaultAddress
    })
  } catch (e) {
    next(e)
  }
}

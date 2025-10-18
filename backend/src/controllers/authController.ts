import { Request, Response, NextFunction } from 'express'
import { comparePassword, generateToken, hashPassword } from '../services/authService'
import { AppError } from '../utils/AppError'
import { setAuthCookie, clearAuthCookie } from '../utils/cookies'
import * as userModel from '../models/user'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, surname, phone } = req.body

    const existingEmail = await userModel.findUserByEmail(email)
    if (existingEmail) throw new AppError('El usuario ya existe', 409)

    const existingPhone = await userModel.findUserByPhone(phone)
    if (existingPhone) throw new AppError('Teléfono ya registrado', 409)

    const hashedPassword = await hashPassword(password)

    const user = await userModel.createUser({ email, password: hashedPassword, name, surname, phone })
    const { password: _, ...publicUser } = user

    const token = generateToken(user.id, user.role)

    setAuthCookie(res, token)

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        publicUser,
        token
      }
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await userModel.findUserByEmail(email)
    if (!user) throw new AppError('Usuario no existe o desactivado', 401)

    const isValid = await comparePassword(password, user.password)
    if (!isValid) throw new AppError('Contraseña incorrecta', 401)

    const token = generateToken(user.id, user.role)

    setAuthCookie(res, token)

    const { password: _, ...publicUser } = user

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: publicUser,
        token
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('No autenticado', 401)
    }

    const user = await userModel.findUserById(req.user.id)

    if (!user) {
      throw new AppError('Usuario no encontrado', 404)
    }

    const { password: _, ...publicUser } = user

    res.status(200).json({
      success: true,
      data: { publicUser }
    })
  } catch (error) {
    next(error)
  }
}

export const logout = (req: Request, res: Response) => {
  clearAuthCookie(res)
  res.status(200).json({
    succes: true,
    message: 'Logout exitoso'
  })
}

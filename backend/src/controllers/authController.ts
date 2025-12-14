import { Request, Response, NextFunction } from 'express'
import { comparePassword, generateAccessToken, generateRefreshToken, hashPassword, calculateExpiry, verifyRefreshToken } from '../services/authService'
import config from '../config/config'
import { AppError } from '../utils/AppError'
import { setAccessTokenCookie, setRefreshTokenCookie, clearAuthCookie } from '../utils/cookies'
import * as userModel from '../models/user'
import * as refreshTokenModel from '../models/refreshToken'

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

    const accessToken = generateAccessToken(user.id, user.role)
    const refreshToken = generateRefreshToken(user.id)

    const expireAt = calculateExpiry(config.jwt.refreshTokenExpiry)
    const deviceInfo = req.headers['user-agent'] || 'Unknown'

    refreshTokenModel.saveRefreshToken(user.id, refreshToken, expireAt, deviceInfo)

    setAccessTokenCookie(res, accessToken)
    setRefreshTokenCookie(res, refreshToken)

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: publicUser,
        accessToken
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

    const accessToken = generateAccessToken(user.id, user.role)
    const refreshToken = generateRefreshToken(user.id)

    const expireAt = calculateExpiry(config.jwt.refreshTokenExpiry)
    const deviceInfo = req.headers['user-agent'] || 'Unknown'

    refreshTokenModel.saveRefreshToken(user.id, refreshToken, expireAt, deviceInfo)

    setAccessTokenCookie(res, accessToken)
    setRefreshTokenCookie(res, refreshToken)

    const { password: _, ...publicUser } = user

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: publicUser,
        accessToken
      }
    })
  } catch (error) {
    next(error)
  }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oldRefreshToken = req.cookies.refresh_token

    if (!oldRefreshToken) {
      throw new AppError('No existe Refresh Token', 401)
    }

    const decoded = verifyRefreshToken(oldRefreshToken)

    const tokenRecord = await refreshTokenModel.findRefreshToken(oldRefreshToken)

    if (!tokenRecord) {
      await refreshTokenModel.deleteAllUserRefreshToken(decoded.userId)
      throw new AppError('Refresh token inválido o ya usado, Por seguridad cerramos las sesiones', 401)
    }

    const date = new Date()
    if (tokenRecord.expiresAt < date) {
      await refreshTokenModel.deleteRefreshToken(oldRefreshToken)
      throw new AppError('Refresh token expirado', 401)
    }

    const user = tokenRecord.user

    if (!user || !user.active) {
      throw new AppError('Usuario no encontrado o inactivo', 401)
    }

    await refreshTokenModel.deleteRefreshToken(oldRefreshToken)

    const newAccessToken = generateAccessToken(user.id, user.role)
    const newRefreshToken = generateRefreshToken(user.id)

    const newExpireAt = calculateExpiry(config.jwt.refreshTokenExpiry)

    await refreshTokenModel.saveRefreshToken(
      user.id,
      newRefreshToken,
      newExpireAt,
      req.headers['user-agent'] || 'Unknown'
    )

    setAccessTokenCookie(res, newAccessToken)
    setRefreshTokenCookie(res, newRefreshToken)

    res.status(200).json({
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        accessToken: newAccessToken
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

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refresh_token
    if (refreshToken) {
      await refreshTokenModel.deleteRefreshToken(refreshToken)
    }

    clearAuthCookie(res)

    res.status(200).json({
      succes: true,
      message: 'Logout exitoso'
    })
  } catch (error) {
    next(error)
  }
}

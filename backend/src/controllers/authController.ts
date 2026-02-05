import { Request, Response, NextFunction } from 'express'
import * as AuthService from '../services/authService'
import config from '../config/config'
import { AppError } from '../utils/AppError'
import { setAccessTokenCookie, setRefreshTokenCookie, clearAuthCookie } from '../utils/cookies'
import * as UserModel from '../models/user'
import * as RefreshTokenModel from '../models/refreshToken'
import { logger } from '../config/logger'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, surname, phone } = req.body

    const existingEmail = await UserModel.findUserByEmail(email)
    if (existingEmail) throw new AppError('El usuario ya existe', 409)

    const existingPhone = await UserModel.findUserByPhone(phone)
    if (existingPhone) throw new AppError('Teléfono ya registrado', 409)

    const hashedPassword = await AuthService.hashPassword(password)

    const user = await UserModel.createUser({ email, password: hashedPassword, name, surname, phone })
    const { password: _, ...publicUser } = user

    const accessToken = AuthService.generateAccessToken(user.id, user.role)
    const refreshToken = AuthService.generateRefreshToken(user.id)

    const expireAt = AuthService.calculateExpiry(config.jwt.refreshTokenExpiry)
    const deviceInfo = req.headers['user-agent'] || 'Unknown'

    RefreshTokenModel.save(user.id, refreshToken, expireAt, deviceInfo)

    setAccessTokenCookie(res, accessToken)
    setRefreshTokenCookie(res, refreshToken)

    logger.info('User registered', {
      userId: user.id,
      email: user.email
    })

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

    const user = await UserModel.findUserByEmail(email)
    if (!user) throw new AppError('Usuario no existe o desactivado', 401)

    const isValid = await AuthService.comparePassword(password, user.password)
    if (!isValid) throw new AppError('Contraseña incorrecta', 401)

    const accessToken = AuthService.generateAccessToken(user.id, user.role)
    const refreshToken = AuthService.generateRefreshToken(user.id)

    const expireAt = AuthService.calculateExpiry(config.jwt.refreshTokenExpiry)
    const deviceInfo = req.headers['user-agent'] || 'Unknown'

    RefreshTokenModel.save(user.id, refreshToken, expireAt, deviceInfo)

    setAccessTokenCookie(res, accessToken)
    setRefreshTokenCookie(res, refreshToken)

    const { password: _, ...publicUser } = user

    logger.info('User logged in', {
      userId: user.id,
      email: user.email
    })

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

    const decoded = AuthService.verifyRefreshToken(oldRefreshToken)

    const tokenRecord = await RefreshTokenModel.findByToken(oldRefreshToken)

    if (!tokenRecord) {
      await RefreshTokenModel.deleteAllByUser(decoded.userId)
      throw new AppError('Refresh token inválido o ya usado, Por seguridad cerramos las sesiones', 401)
    }

    const date = new Date()
    if (tokenRecord.expiresAt < date) {
      await RefreshTokenModel.deleteByToken(oldRefreshToken)
      throw new AppError('Refresh token expirado', 401)
    }

    const user = tokenRecord.user

    if (!user || !user.active) {
      throw new AppError('Usuario no encontrado o inactivo', 401)
    }

    await RefreshTokenModel.deleteByToken(oldRefreshToken)

    const newAccessToken = AuthService.generateAccessToken(user.id, user.role)
    const newRefreshToken = AuthService.generateRefreshToken(user.id)

    const newExpireAt = AuthService.calculateExpiry(config.jwt.refreshTokenExpiry)

    await RefreshTokenModel.save(
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

    const user = await UserModel.findUserById(req.user.id)

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
      await RefreshTokenModel.deleteByToken(refreshToken)
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

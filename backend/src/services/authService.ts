import bcrypt from 'bcrypt'
import config from '../config/config'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError'

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, config.bcrypt.saltRounds)
}

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

interface JwtPayload {
  userId: string
  role: string
}

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, config.jwt.accessTokenSecret as string, {
    // Utilizo as jwt.SignOptions['expiresIn'] para que no falle el casteo de string a StringValue '7d' | '1h' ...
    expiresIn: config.jwt.accessTokenExpiry as jwt.SignOptions['expiresIn']
  })
}

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwt.refreshTokenSecret as string, {
    // Utilizo as jwt.SignOptions['expiresIn'] para que no falle el casteo de string a StringValue '7d' | '1h' ...
    expiresIn: config.jwt.refreshTokenExpiry as jwt.SignOptions['expiresIn']
  })
}

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwt.accessTokenSecret) as JwtPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expirado', 401)
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Token inválido', 401)
    }
    throw new AppError('Error al verificar el token', 401)
  }
}

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwt.refreshTokenSecret) as JwtPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expirado', 401)
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Token inválido', 401)
    }
    throw new AppError('Error al verificar el token', 401)
  }
}

export const calculateExpiry = (time: string): Date => {
  const value = parseInt(time)
  const unit = time.slice(-1)

  const multipliers: Record<string, number> = {
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
    M: 30 * 24 * 60 * 60
  }

  const date = new Date()
  date.setSeconds(date.getSeconds() + (value * (multipliers[unit] || 1)))
  return date
}

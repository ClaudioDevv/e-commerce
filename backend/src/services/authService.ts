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

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, config.jwt.secret as string, {
    // Utilizo as jwt.SignOptions['expiresIn'] para que no falle el casteo de string a StringValue '7d' | '1h' ...
    expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn']
  })
}

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as JwtPayload
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

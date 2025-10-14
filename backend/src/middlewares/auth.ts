import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../services/authService'
import { AppError } from '../utils/AppError'
import { UserRole, PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: UserRole
      }
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction
) => {
  try {
    const token = req.cookies.access_token

    if (!token) {
      throw new AppError('No se proporcionó token de autenticación', 401)
    }

    const decoded = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, active: true }
    })

    if (!user || !user.active) {
      throw new AppError('Usuario no encontrado o inactivo', 401)
    }

    req.user = {
      id: user.id,
      role: user.role
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Usuario no autenticado', 401))
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('No tienes permisos para realizar esta acción', 403))
    }

    next()
  }
}

import { Request, Response, NextFunction } from 'express'
import { logger } from '../config/logger'

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500

  logger.error(err.message, {
    statusCode,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
    stack: err.stack,
    isOperational: err.isOperational
  })

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  })
}

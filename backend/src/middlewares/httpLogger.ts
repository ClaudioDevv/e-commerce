import { Request, Response, NextFunction } from 'express'
import { httpLogger } from '../config/logger'

export const logHttpRequest = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  // Cuando termina la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start

    httpLogger.info(`${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
      ip: req.ip
    })
  })

  next()
}

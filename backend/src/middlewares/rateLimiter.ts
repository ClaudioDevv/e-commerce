import rateLimit from 'express-rate-limit'

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Demasiadas peticiones, intentelo de nuevo más tarde'
  },
  legacyHeaders: false,
})

// Rate Limiter Estricto
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'Demasiados intentos de inicio de sesión, intentelo de nuevo en 15 minutos'
  },
  skipSuccessfulRequests: true,
})

export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    error: 'Demasiados intentos de pago. Por favor contacta con soporte'
  },
})

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    error: 'Demasiados registros desde esta IP. Intenta de nuevo en 1 hora'
  },
})

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    error: 'Límite de peticiones excedido. INtenta de nuevo en 1 minuto'
  }
})

import winston from 'winston'
import path from 'path'

const logsDir = path.join(__dirname, '../../logs')

// Formato personalizado
const customFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`

  // Si hay metadata adicional (userId, orderId, etc.)
  if (Object.keys(meta).length > 0) {
    msg += ` ${JSON.stringify(meta)}`
  }

  return msg
})

// Logger principal
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    ...(process.env.NODE_ENV !== 'production'
      ? [new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            customFormat
          )
        })]
      : []
    ),

    // Archivo de errores
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),

    // Archivo combinado
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
})

// Logger específico para HTTP
export const httpLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'http.log'),
      maxsize: 5242880,
      maxFiles: 3
    })
  ]
})

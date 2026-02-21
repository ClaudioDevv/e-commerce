import { CorsOptions } from 'cors'
import config from './config'

const developmentOrigins = [
  'http://localhost:3000',
  config.frontendUrl,
]

const productionOrigins = [
  'https://dominio-final.com',
  'https://www.dominio-final.com',
  'https://panel-admin.com',
]

const allowedOrigins = config.nodeEnv === 'production'
  ? productionOrigins
  : developmentOrigins

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400,
}

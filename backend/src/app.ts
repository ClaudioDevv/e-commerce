import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger'
import { corsOptions } from './config/cors'
import { errorHandler } from './middlewares/errorHandler'
import { logHttpRequest } from './middlewares/httpLogger'
import routes from './routes/index'
import paymentRoutes from './routes/paymentRoutes'
import * as RateLimiter from './middlewares/rateLimiter'

const app = express()

// Security and CORS
app.use(cors(corsOptions))
app.use(helmet())
app.disable('x-powered-by')

// Rate Limiting
app.use(RateLimiter.generalLimiter)
app.use('/api/auth/login', RateLimiter.authLimiter)
app.use('/api/auth/register', RateLimiter.registerLimiter)
app.use('/api/orders/:id/checkout', RateLimiter.paymentLimiter)
app.use('/api/orders/guest/:id/checkout', RateLimiter.paymentLimiter)

// Logger http
app.use(logHttpRequest)

// Webhook stripe texto plano
app.use('/api/payments', paymentRoutes)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pizza API Docs'
}))

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Api funcionando correctamente' })
})

app.use('/api', routes)

// 404 handler
app.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`
  })
})

// Global Error Handler
app.use(errorHandler)

export default app

import express from 'express'
import helmet from 'helmet'
// import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes/index'
import { errorHandler } from './middlewares/errorHandler'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.disable('x-powered-by')

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pizza API Docs'
}))

// Endpoint para obtener el JSON de OpenAPI
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

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

// Global Error Handler depués de las rutas
app.use(errorHandler)

export default app

import express from 'express'
import helmet from 'helmet'
// import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes/index'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.json({ message: 'Api funcionando correctamente' })
})

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
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

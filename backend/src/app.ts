import express from 'express'
import { errorHandler } from './middlewares/errorHandler'
import productRoutes from './routes/productRoutes'
import authRoutes from './routes/authRoutes'
import ingredientRoutes from './routes/ingredientRoutes'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('<h1>Hola Mundo<h1>')
})

// Routes
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/ingredients', ingredientRoutes)

// Global Error Handler depués de las rutas
app.use(errorHandler)

export default app

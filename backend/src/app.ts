import express from 'express'

import addressRouter from './routes/addressRoutes'
import productRoutes from './routes/productRoutes'
import authRoutes from './routes/authRoutes'
import ingredientRoutes from './routes/ingredientRoutes'
import cartRoutes from './routes/cartRoutes'

import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.json({ message: 'Api funcionando correctamente' })
})

// Routes
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/ingredients', ingredientRoutes)
app.use('/api/addresses', addressRouter)
app.use('/api/cart', cartRoutes)

// Global Error Handler depués de las rutas
app.use(errorHandler)

export default app

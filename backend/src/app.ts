import express from 'express'
import { errorHandler } from './middlewares/errorHandler'
import productRoutes from './routes/productRoutes'
// import userRoutes from './routes/userRoutes'
import ingredientRoutes from './routes/ingredientRoutes'
import helmet from 'helmet'

const app = express()

app.use(helmet())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hola Mundo<h1>')
})

// Routes
app.use('/api/products', productRoutes)
// app.use('/api/user', userRoutes)
app.use('/api/ingredients', ingredientRoutes)

// Global Error Handler
app.use(errorHandler)

export default app

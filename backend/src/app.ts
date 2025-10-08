import express from 'express'
import { errorHandler } from './middlewares/errorHandler'
import pizzaRoutes from './routes/pizzaRoutes'
import userRoutes from './routes/userRoutes'
import ingredientRoutes from './routes/ingredientRoutes'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hola Mundo<h1>')
})

// Routes
app.use('/api/pizza', pizzaRoutes)
app.use('/api/user', userRoutes)
app.use('/api/ingredient', ingredientRoutes)

// Global Error Handler
app.use(errorHandler)

export default app

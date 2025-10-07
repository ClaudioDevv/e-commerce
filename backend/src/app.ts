import express from 'express'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hola Mundo<h1>')
})

// Routes
// app.use('/api/loquesea')

// Global Error Handler
app.use(errorHandler)

export default app

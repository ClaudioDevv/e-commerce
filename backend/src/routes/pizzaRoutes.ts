import { Router } from 'express'
import { getPizzas, getPizzaById } from '../controllers/pizzaController'

const router = Router()

router.get('/', getPizzas)
router.get('/:id', getPizzaById)

export default router

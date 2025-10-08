import { Router } from 'express'
import { getIngredients } from '../controllers/ingredientController'

const router = Router()

router.get('/', getIngredients)

export default router

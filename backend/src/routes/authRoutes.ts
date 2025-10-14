import { Router } from 'express'
import { register, login, getMe, logout } from '../controllers/authController'
import { authenticate } from '../middlewares/auth'
import { validateRequest } from '../middlewares/validateRequest'
import { registerSchema, loginSchema } from '../validators/authValidator'

const router = Router()

router.post('/register', validateRequest(registerSchema), register)
router.post('/login', validateRequest(loginSchema), login)
router.post('/logout', logout)

// Ruta protegida
router.get('/me', authenticate, getMe)

export default router

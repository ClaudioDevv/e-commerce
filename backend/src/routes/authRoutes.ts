import { Router } from 'express'
import { register, login, refresh, getMe, logout } from '../controllers/authController'
import { authenticate } from '../middlewares/auth'
import { validateRequest } from '../middlewares/validateRequest'
import { registerSchema, loginSchema } from '../validators/authValidator'

const router = Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Crea una cuenta de usuario nueva. El token JWT se devuelve en la respuesta y también se establece en una cookie httpOnly
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         headers:
 *           Set-Cookie:
 *             description: Cookie httpOnly con el token JWT
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario registrado exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       description: JWT token
 *       400:
 *         description: Error de validización
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email o teléfono ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               emailExists:
 *                 value:
 *                   success: false
 *                   message: "El usuario ya existe"
 *               phoneExists:
 *                 value:
 *                   success: false
 *                   message: "Teléfono ya registrado"
 */
router.post('/register', validateRequest(registerSchema), register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario existente. El token JWT se devuelve en la respuesta y también se establece en una cookie httpOnly
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         headers:
 *           Set-Cookie:
 *             description: Cookie httpOnly con el token JWT
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login exitoso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               userNotFound:
 *                 value:
 *                   success: false
 *                   message: "Usuario no existe o desactivado"
 *               wrongPassword:
 *                 value:
 *                   success: false
 *                   message: "Contraseña incorrecta"
 */
router.post('/login', validateRequest(loginSchema), login)

router.post('/refresh', refresh)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Invalida la cookie de sesión del usuario
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso
 *         headers:
 *           Set-Cookie:
 *             description: Cookie eliminada
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logout exitoso"
 */
router.post('/logout', authenticate, logout)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener usuario actual
 *     description: Devuelve la información del usuario autenticado actualmente
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado o token inválido/expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notAuthenticated:
 *                 value:
 *                   success: false
 *                   message: "No autenticado"
 *               tokenExpired:
 *                 value:
 *                   success: false
 *                   message: "Token expirado"
 *               tokenInvalid:
 *                 value:
 *                   success: false
 *                   message: "Token inválido"
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/me', authenticate, getMe)

export default router

// src/routes/cartRoutes.ts
import { Router } from 'express'
import { authenticate } from '../middlewares/auth'
import * as CartController from '../controllers/cartController'
import { validateRequest } from '../middlewares/validateRequest'
import { cartItemSchema, updateCartItemSchema } from '../validators/cartValidator'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obtener carrito completo del usuario
 *     description: Devuelve todos los items del carrito con información de productos, variantes e ingredientes
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Carrito obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', CartController.getAllCart)

/**
 * @swagger
 * /api/cart/summary:
 *   get:
 *     summary: Obtener resumen del carrito
 *     description: Devuelve subtotal, cantidad de items y número de productos distintos
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Resumen calculado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CartSummary'
 *       401:
 *         description: No autenticado
 */
router.get('/summary', CartController.getSummary)

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Añadir producto al carrito
 *     description: Añade un producto al carrito. Si ya existe un item idéntico (mismo producto, variante e ingredientes), incrementa la cantidad
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItemInput'
 *     responses:
 *       201:
 *         description: Producto añadido al carrito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Error de validación (producto no disponible, ingrediente inválido, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Producto no encontrado
 */
router.post('/items', validateRequest(cartItemSchema), CartController.addToCart)

/**
 * @swagger
 * /api/cart/items/{id}:
 *   put:
 *     summary: Actualizar item del carrito
 *     description: Actualiza cantidad, notas o ingredientes personalizados de un item existente
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del item del carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItemInput'
 *           examples:
 *             updateQuantity:
 *               summary: Actualizar cantidad
 *               value:
 *                 quantity: 3
 *             updateNotes:
 *               summary: Actualizar notas
 *               value:
 *                 notes: "Bien hecha por favor"
 *             updateIngredients:
 *               summary: Actualizar ingredientes
 *               value:
 *                 customIngredients:
 *                   - ingredientId: 5
 *                     action: ADD
 *     responses:
 *       200:
 *         description: Item actualizado correctamente
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
 *                   example: "Carrito actualizado"
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Item no encontrado o no pertenece al usuario
 */
router.put('/items/:id', validateRequest(updateCartItemSchema), CartController.updateCartItem)

/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Eliminar un item del carrito
 *     description: Elimina un producto específico del carrito del usuario
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del item del carrito
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
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
 *                   example: "Producto borrado con éxito"
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Item no encontrado o no pertenece al usuario
 */
router.delete('/items/:id', CartController.deleteItem)

/**
 * @swagger
 * /api/cart/items:
 *   delete:
 *     summary: Vaciar carrito completo
 *     description: Elimina todos los items del carrito del usuario
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Carrito vaciado correctamente
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
 *                   example: "Carrito borrado con éxito"
 *       401:
 *         description: No autenticado
 */
router.delete('/', CartController.clearCart)

export default router

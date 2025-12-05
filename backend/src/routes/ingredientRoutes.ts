import { Router } from 'express'
import { getIngredients } from '../controllers/ingredientController'

const router = Router()

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Obtener todos los ingredientes
 *     tags: [Ingredients]
 *     description: Retorna la lista completa de ingredientes disponibles para personalizar pizzas
 *     responses:
 *       200:
 *         description: Lista de ingredientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IngredientsResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   name: "Mozzarella"
 *                   extraPrice: "1.50"
 *                   available: true
 *                   category: "QUESO"
 *                   imageUrl: "https://example.com/mozzarella.jpg"
 *                   createdAt: "2024-01-15T10:30:00.000Z"
 *                 - id: 2
 *                   name: "Pepperoni"
 *                   extraPrice: "2.00"
 *                   available: true
 *                   category: "CARNE"
 *                   imageUrl: "https://example.com/pepperoni.jpg"
 *                   createdAt: "2024-01-15T10:30:00.000Z"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getIngredients)

export default router

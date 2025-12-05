import { Router } from 'express'
import * as addressController from '../controllers/addressController'
import { authenticate } from '../middlewares/auth'
import { validateRequest } from '../middlewares/validateRequest'
import { addressSchema, updateAddressSchema } from '../validators/addressValidator'

const router = Router()

router.use(authenticate)

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Obtener todas las direcciones del usuario
 *     tags: [Addresses]
 *     security:
 *       - cookieAuth: []
 *     description: Retorna todas las direcciones guardadas del usuario autenticado
 *     responses:
 *       200:
 *         description: Lista de direcciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressesResponse'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "No autenticado"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', addressController.getAllAddresses)

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     summary: Obtener una dirección específica
 *     tags: [Addresses]
 *     security:
 *       - cookieAuth: []
 *     description: Retorna los detalles de una dirección específica del usuario autenticado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dirección
 *         example: "850e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Dirección obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressResponse'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Dirección no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Dirección no encontrada"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', addressController.getAddressById)

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Crear una nueva dirección
 *     tags: [Addresses]
 *     security:
 *       - cookieAuth: []
 *     description: Crea una nueva dirección de entrega para el usuario autenticado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInput'
 *     responses:
 *       201:
 *         description: Dirección creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressCreatedResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidPostalCode:
 *                 summary: Código postal inválido
 *                 value:
 *                   success: false
 *                   message: "El Código postal debe tener exactamente 5 dígitos"
 *               streetTooShort:
 *                 summary: Calle demasiado corta
 *                 value:
 *                   success: false
 *                   message: "La calle debe tener mínimo 5 caracteres"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', validateRequest(addressSchema), addressController.createAddress)

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Actualizar una dirección
 *     tags: [Addresses]
 *     security:
 *       - cookieAuth: []
 *     description: Actualiza los datos de una dirección existente. Al menos un campo debe ser proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dirección a actualizar
 *         example: "850e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAddressInput'
 *     responses:
 *       200:
 *         description: Dirección actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressUpdatedResponse'
 *       400:
 *         description: Datos de entrada inválidos o sin campos para actualizar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Debe proporcionar al menos un campo para actualizar"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Dirección no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Dirección no encontrada"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', validateRequest(updateAddressSchema), addressController.updateAddress)

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Eliminar una dirección
 *     tags: [Addresses]
 *     security:
 *       - cookieAuth: []
 *     description: Elimina permanentemente una dirección del usuario autenticado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dirección a eliminar
 *         example: "850e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Dirección eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressDeletedResponse'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Dirección no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Dirección no encontrada"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', addressController.deleteAddressById)

/**
 * @swagger
 * /api/addresses/{id}/default:
 *   patch:
 *     summary: Marcar dirección como predeterminada
 *     tags: [Addresses]
 *     security:
 *       - cookieAuth: []
 *     description: Establece una dirección como la predeterminada del usuario. Automáticamente desmarca cualquier otra dirección que estuviera marcada como predeterminada.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dirección a marcar como predeterminada
 *         example: "850e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Dirección marcada como predeterminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressDefaultResponse'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Dirección no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Dirección no encontrada"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/default', addressController.setDefaultAddress)

export default router

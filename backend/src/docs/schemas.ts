/**
 * @swagger
 * components:
 *   schemas:
 *
 *     RegisterInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - surname
 *         - phone
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           minLength: 8
 *           format: password
 *           description: Contraseña (mínimo 8 caracteres)
 *         name:
 *           type: string
 *           minLength: 2
 *           description: Nombre del usuario
 *         surname:
 *           type: string
 *           minLength: 2
 *           description: Apellido del usuario
 *         phone:
 *           type: string
 *           pattern: '^[0-9]{9}$'
 *           description: Teléfono (exactamente 9 dígitos)
 *       example:
 *         email: "juan@example.com"
 *         password: "miPassword123"
 *         name: "Juan"
 *         surname: "Pérez"
 *         phone: "612345678"
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *       example:
 *         email: "juan@example.com"
 *         password: "miPassword123"
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         surname:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [CUSTOMER, ADMIN, STAFF]
 *         active:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 *               description: JWT token (también se envía en cookie httpOnly)
 *
 *     CustomIngredient:
 *       type: object
 *       required:
 *         - ingredientId
 *         - action
 *       properties:
 *         ingredientId:
 *           type: integer
 *         action:
 *           type: string
 *           enum: [ADD, REMOVE]
 *
 *     CartItemInput:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *         variantId:
 *           type: string
 *           format: uuid
 *           description: ID de la variante. Requerido para pizzas
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         notes:
 *           type: string
 *           maxLength: 100
 *         customIngredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CustomIngredient'
 *       example:
 *         productId: "550e8400-e29b-41d4-a716-446655440000"
 *         variantId: "650e8400-e29b-41d4-a716-446655440001"
 *         quantity: 2
 *         notes: "Sin cebolla por favor"
 *         customIngredients:
 *           - ingredientId: 5
 *             action: ADD
 *           - ingredientId: 12
 *             action: REMOVE
 *
 *     UpdateCartItemInput:
 *       type: object
 *       properties:
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         notes:
 *           type: string
 *           maxLength: 100
 *         customIngredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CustomIngredient'
 *       description: Al menos un campo es requerido
 *
 *     Ingredient:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: string
 *         available:
 *           type: boolean
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *           enum: [PIZZA, BEVERAGE, DESSERT, STARTER]
 *         active:
 *           type: boolean
 *
 *     Variant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         price:
 *           type: string
 *         active:
 *           type: boolean
 *
 *     CartItemIngredient:
 *       type: object
 *       properties:
 *         ingredientId:
 *           type: integer
 *         action:
 *           type: string
 *           enum: [ADD, REMOVE]
 *         ingredient:
 *           $ref: '#/components/schemas/Ingredient'
 *
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         productId:
 *           type: string
 *           format: uuid
 *         variantId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         quantity:
 *           type: integer
 *         notes:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         variant:
 *           $ref: '#/components/schemas/Variant'
 *           nullable: true
 *         customIngredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItemIngredient'
 *
 *     CartSummary:
 *       type: object
 *       properties:
 *         subtotal:
 *           type: string
 *         totalItems:
 *           type: integer
 *         itemsCount:
 *           type: integer
 *       example:
 *         subtotal: "45.50"
 *         totalItems: 5
 *         itemsCount: 3
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *       example:
 *         success: false
 *         message: "Producto no disponible"
 */

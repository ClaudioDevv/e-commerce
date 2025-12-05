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
 *         extraPrice:
 *           type: string
 *           description: Precio extra por añadir el ingrediente
 *         available:
 *           type: boolean
 *         category:
 *           type: string
 *           enum: [QUESO, CARNE, VEGETAL, SALSA, EXTRA]
 *           nullable: true
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         name: "Mozzarella"
 *         extraPrice: "1.50"
 *         available: true
 *         category: "QUESO"
 *         imageUrl: "https://example.com/mozzarella.jpg"
 *         createdAt: "2024-01-15T10:30:00.000Z"
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
 *           nullable: true
 *         category:
 *           type: string
 *           enum: [PIZZA, BEBIDA, ENTRANTE, POSTRE]
 *         basePrice:
 *           type: string
 *           description: Precio base del producto
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         active:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         name: "Pizza Margarita"
 *         description: "Pizza clásica con tomate y mozzarella"
 *         category: "PIZZA"
 *         basePrice: "8.50"
 *         imageUrl: "https://example.com/margarita.jpg"
 *         active: true
 *         createdAt: "2024-01-15T10:30:00.000Z"
 *         updatedAt: "2024-01-15T10:30:00.000Z"
 *
 *     Variant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           description: Nombre de la variante (ej. Mediana, Familiar, 1L)
 *         priceDelta:
 *           type: string
 *           description: Diferencia de precio respecto al precio base
 *         active:
 *           type: boolean
 *         productId:
 *           type: string
 *           format: uuid
 *       example:
 *         id: "650e8400-e29b-41d4-a716-446655440001"
 *         name: "Familiar"
 *         priceDelta: "5.00"
 *         active: true
 *         productId: "550e8400-e29b-41d4-a716-446655440000"
 *
 *     PizzaBaseIngredient:
 *       type: object
 *       properties:
 *         ingredientId:
 *           type: integer
 *         ingredient:
 *           $ref: '#/components/schemas/Ingredient'
 *
 *     PizzaConfig:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         productId:
 *           type: string
 *           format: uuid
 *         allowCustomization:
 *           type: boolean
 *         baseIngredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PizzaBaseIngredient'
 *       example:
 *         id: "750e8400-e29b-41d4-a716-446655440002"
 *         productId: "550e8400-e29b-41d4-a716-446655440000"
 *         allowCustomization: true
 *         baseIngredients:
 *           - ingredientId: 1
 *             ingredient:
 *               id: 1
 *               name: "Mozzarella"
 *               extraPrice: "1.50"
 *               available: true
 *
 *     ProductDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         category:
 *           type: string
 *           enum: [PIZZA, BEBIDA, ENTRANTE, POSTRE]
 *         basePrice:
 *           type: string
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         active:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *         pizzaConfig:
 *           $ref: '#/components/schemas/PizzaConfig'
 *           nullable: true
 *           description: Solo presente si el producto es una pizza
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         name: "Pizza Margarita"
 *         description: "Pizza clásica con tomate y mozzarella"
 *         category: "PIZZA"
 *         basePrice: "8.50"
 *         imageUrl: "https://example.com/margarita.jpg"
 *         active: true
 *         variants:
 *           - id: "650e8400-e29b-41d4-a716-446655440001"
 *             name: "Mediana"
 *             priceDelta: "0.00"
 *             active: true
 *           - id: "650e8400-e29b-41d4-a716-446655440002"
 *             name: "Familiar"
 *             priceDelta: "5.00"
 *             active: true
 *         pizzaConfig:
 *           id: "750e8400-e29b-41d4-a716-446655440002"
 *           allowCustomization: true
 *           baseIngredients:
 *             - ingredientId: 1
 *               ingredient:
 *                 id: 1
 *                 name: "Mozzarella"
 *                 extraPrice: "1.50"
 *                 available: true
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
 *     ProductsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductDetail'
 *         count:
 *           type: integer
 *           description: Número total de productos
 *           example: 15
 *
 *     ProductsByCategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductDetail'
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/ProductDetail'
 *
 *     IngredientsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ingredient'
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

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     RegisterInput:
 *       type: object
 *       required: [email, password, name, surname, phone]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 8
 *           format: password
 *         name:
 *           type: string
 *           minLength: 2
 *         surname:
 *           type: string
 *           minLength: 2
 *         phone:
 *           type: string
 *           pattern: '^[0-9]{9}$'
 *       example:
 *         email: "juan@example.com"
 *         password: "miPassword123"
 *         name: "Juan"
 *         surname: "Pérez"
 *         phone: "612345678"
 *
 *     LoginInput:
 *       type: object
 *       required: [email, password]
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
 *
 *     CustomIngredient:
 *       type: object
 *       required: [ingredientId, action]
 *       properties:
 *         ingredientId:
 *           type: integer
 *         action:
 *           type: string
 *           enum: [ADD, REMOVE]
 *
 *     CartItemInput:
 *       type: object
 *       required: [productId, quantity]
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *         variantId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         notes:
 *           type: string
 *           maxLength: 100
 *           nullable: true
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
 *
 *     Variant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         priceDelta:
 *           type: string
 *         active:
 *           type: boolean
 *         productId:
 *           type: string
 *           format: uuid
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
 *
 *     ProductDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Product'
 *         - type: object
 *           properties:
 *             variants:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Variant'
 *             pizzaConfig:
 *               $ref: '#/components/schemas/PizzaConfig'
 *               nullable: true
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
 *
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         label:
 *           type: string
 *           maxLength: 20
 *           nullable: true
 *         street:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *         city:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         postalCode:
 *           type: string
 *           pattern: '^[0-9]{5}$'
 *         province:
 *           type: string
 *           maxLength: 50
 *           nullable: true
 *         instructions:
 *           type: string
 *           maxLength: 200
 *           nullable: true
 *         isDefault:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     AddressInput:
 *       type: object
 *       required: [street, city, postalCode]
 *       properties:
 *         label:
 *           type: string
 *           maxLength: 20
 *         street:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *         city:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         postalCode:
 *           type: string
 *           pattern: '^[0-9]{5}$'
 *         province:
 *           type: string
 *           maxLength: 50
 *         instructions:
 *           type: string
 *           maxLength: 200
 *         isDefault:
 *           type: boolean
 *
 *     UpdateAddressInput:
 *       type: object
 *       properties:
 *         label:
 *           type: string
 *           maxLength: 20
 *         street:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *         city:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         postalCode:
 *           type: string
 *           pattern: '^[0-9]{5}$'
 *         province:
 *           type: string
 *           maxLength: 50
 *         instructions:
 *           type: string
 *           maxLength: 200
 *         isDefault:
 *           type: boolean
 *       description: Al menos un campo es requerido
 *
 *     ProductsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductDetail'
 *         count:
 *           type: integer
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/ProductDetail'
 *
 *     IngredientsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ingredient'
 *
 *     AddressesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         count:
 *           type: integer
 *
 *     AddressResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/Address'
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

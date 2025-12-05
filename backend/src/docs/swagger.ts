import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce Pizza API',
      version: '1.0.0',
      description: 'API para gestión de pedidos de restaurante con carrito persistente',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT almacenado en cookie httpOnly'
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Gestión de usuarios y autenticación'
      },
      {
        name: 'Products',
        description: 'Gestión de productos, variantes y categorías'
      },
      {
        name: 'Ingredients',
        description: 'Gestión de ingredientes para personalización de pizzas'
      },
      {
        name: 'Cart',
        description: 'Gestión del carrito de compras'
      },
      {
        name: 'Orders',
        description: 'Gestión de pedidos'
      },
      {
        name: 'Addresses',
        description: 'Gestión de direcciones de entrega'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/docs/schemas.ts'
  ]
}

export const swaggerSpec = swaggerJsdoc(options)

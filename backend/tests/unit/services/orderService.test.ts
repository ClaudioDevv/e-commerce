import { CartItem } from '../../../src/generated/prisma'
import { prisma } from '../../../src/lib/prisma'
import { validateProducts } from '../../../src/services/orderService'

jest.mock('../../../src/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
    ingredient: {
      findMany: jest.fn(),
    }
  }
}))

describe('validateProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Producto no existente → AppError 404', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([])

    const items = [
      { productId: 'id-no-existente', quantity: 1 }
    ] as CartItem[]

    await expect(validateProducts(items))
      .rejects
      .toThrow('Producto no disponible')
  })

  test('Producto inactivo → AppError 404', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        id: '123',
        active: false,
        name: 'Pizza',
        variants: []
      }
    ])

    const items = [
      { productId: '123', quantity: 1 }
    ] as CartItem[]

    await expect(validateProducts(items))
      .rejects
      .toThrow('Producto no disponible')
  })

  test('Variante inválida → AppError 400', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        id: '123',
        active: true,
        name: 'Pizza Carbonara',
        category: 'PIZZA',
        variants: [{ id: 'v1', active: true }],
        pizzaConfig: { allowCustomization: true }
      }
    ])

    const items = [
      {
        productId: '123',
        variantId: 'v-inexistente',
        quantity: 1
      }
    ] as CartItem[]

    await expect(validateProducts(items))
      .rejects
      .toThrow('Tamaño no válido para Pizza Carbonara')
  })

  test('Producto con variantes pero sin variantId → AppError 400', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        id: '123',
        active: true,
        name: 'Pizza Carbonara',
        category: 'PIZZA',
        variants: [{ id: 'v1', active: true }],
        pizzaConfig: { allowCustomization: true }
      }
    ])

    const items = [
      {
        productId: '123',
        quantity: 1
      }
    ] as CartItem[]

    await expect(validateProducts(items))
      .rejects
      .toThrow('Debes seleccionar un tamaño para Pizza Carbonara')
  })

  test('Producto no permite personalización → AppError 400', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        id: '123',
        active: true,
        name: 'Cola',
        category: 'BEBIDA',
        variants: [{ id: 'v1', active: true }]
      }
    ])

    ;(prisma.ingredient.findMany as jest.Mock).mockResolvedValue([])

    const items = [
      {
        productId: '123',
        variantId: 'v1',
        quantity: 1,
        customIngredients: [{ ingredientId: 1, action: 'ADD' }]
      }
    ] as any

    await expect(validateProducts(items))
      .rejects
      .toThrow('Cola no permite personalización')
  })

  test('Pizza sin personalización activada → AppError 400', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        id: '123',
        active: true,
        name: 'Pizza Carbonara',
        category: 'PIZZA',
        variants: [{ id: 'v1', active: true }],
        pizzaConfig: { allowCustomization: false }
      }
    ])

    ;(prisma.ingredient.findMany as jest.Mock).mockResolvedValue([])

    const items = [
      {
        productId: '123',
        variantId: 'v1',
        quantity: 1,
        customIngredients: [{ ingredientId: 1, action: 'ADD' }]
      }
    ] as any

    await expect(validateProducts(items))
      .rejects
      .toThrow('Pizza Carbonara no permite personalización')
  })

  test('Ingrediente no disponible → AppError 400', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        id: '123',
        active: true,
        name: 'Pizza Carbonara',
        category: 'PIZZA',
        variants: [{ id: 'v1', active: true }],
        pizzaConfig: { allowCustomization: true }
      }
    ])

    ;(prisma.ingredient.findMany as jest.Mock).mockResolvedValue([])

    const items = [
      {
        productId: '123',
        variantId: 'v1',
        quantity: 1,
        customIngredients: [{ ingredientId: 99, action: 'ADD' }]
      }
    ] as any

    await expect(validateProducts(items))
      .rejects
      .toThrow('Algún ingrediente seleccionado en Pizza Carbonara no está disponible')
  })

  test('Funcionamiento correcto', async () => {
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        id: '123',
        active: true,
        name: 'Pizza Carbonara',
        category: 'PIZZA',
        variants: [{ id: 'v1', active: true }],
        pizzaConfig: { allowCustomization: true }
      }
    ])

    ;(prisma.ingredient.findMany as jest.Mock).mockResolvedValue([
      { id: 99, available: true }
    ])

    const items = [
      {
        productId: '123',
        variantId: 'v1',
        quantity: 1,
        customIngredients: [{ ingredientId: 99, action: 'ADD' }]
      }
    ] as any

    await expect(validateProducts(items))
      .resolves
      .not.toThrow()
  })
})

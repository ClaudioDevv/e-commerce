import { CartItem } from '../../../src/generated/prisma'
import { prisma } from '../../../src/lib/prisma'
import { validateProducts } from '../../../src/services/orderService'

jest.mock('../../../src/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
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

  test('Producto no existente, AppError 404', async () => {
    const findUniqueMock = prisma.product.findUnique as jest.Mock
    findUniqueMock.mockResolvedValue(null)

    const items = [{ productId: 'id-no-existente', quantity: 1 }] as CartItem []

    await expect(validateProducts(items)).rejects.toThrow('Producto no disponible')
  })

  test('Producto inactivo, AppError 404', async () => {
    const findUniqueMock = prisma.product.findUnique as jest.Mock
    findUniqueMock.mockResolvedValue({ active: false })

    const items = [{ productId: 'id-de-producto-inactivo', quantity: 1 }] as CartItem []

    await expect(validateProducts(items)).rejects.toThrow('Producto no disponible')
  })

  test('Variante inválida, AppError 400', async () => {
    const findUniqueMock = prisma.product.findUnique as jest.Mock
    const mockProduct = {
      id: '123',
      active: true,
      name: 'Pizza Carbonara',
      variants: [{ id: 'v1', active: true }]
    }
    findUniqueMock.mockResolvedValue(mockProduct)

    const items = [{ productId: '123', variantId: 'id-inexistente', quantity: 1 }] as CartItem []

    await expect(validateProducts(items)).rejects.toThrow('Tamaño no válido para Pizza Carbonara')
  })

  test('Producto sin personalización, AppError 400', async () => {
    const findUniqueMock = prisma.product.findUnique as jest.Mock
    const mockProduct = {
      id: '123',
      active: true,
      name: 'Cola',
      category: 'Bebida',
      variants: [{ id: 'v1', active: true }]
    }
    findUniqueMock.mockResolvedValue(mockProduct)

    const items = [{
      productId: '123',
      variantId: 'v1',
      quantity: 1,
      customIngredients: [{ ingredientId: 1, action: 'ADD' }]
    }] as any

    await expect(validateProducts(items)).rejects.toThrow('Cola no permite personalización')
  })

  test('Pizza sin personalización activada, AppError 400', async () => {
    const findUniqueMock = prisma.product.findUnique as jest.Mock
    const mockProduct = {
      id: '123',
      active: true,
      name: 'Pizza Carbonara',
      category: 'PIZZA',
      variants: [{ id: 'v1', active: true }]
    }
    findUniqueMock.mockResolvedValue(mockProduct)

    const items = [{
      productId: '123',
      variantId: 'v1',
      quantity: 1,
      customIngredients: [{ ingredientId: 1, action: 'ADD' }]
    }] as any

    await expect(validateProducts(items)).rejects.toThrow('Pizza Carbonara no permite personalización')
  })

  test('Ingrediente no disponible, AppError 400', async () => {
    const findUniqueMock = prisma.product.findUnique as jest.Mock
    const mockProduct = {
      id: '123',
      active: true,
      name: 'Pizza Carbonara',
      category: 'PIZZA',
      variants: [{ id: 'v1', active: true }],
      pizzaConfig: { allowCustomization: true }
    }
    findUniqueMock.mockResolvedValue(mockProduct)

    const items = [{
      productId: '123',
      variantId: 'v1',
      quantity: 1,
      customIngredients: [{ ingredientId: 99, action: 'ADD' }]
    }] as any
    const findManyMock = prisma.ingredient.findMany as jest.Mock
    findManyMock.mockResolvedValue([])

    await expect(validateProducts(items)).rejects.toThrow('Algún ingrediente seleccionado en Pizza Carbonara no está disponible')
  })

  test('Funcionamiento correcto', async () => {
    const findUniqueMock = prisma.product.findUnique as jest.Mock
    const findManyMock = prisma.ingredient.findMany as jest.Mock

    findUniqueMock.mockResolvedValue({
      id: '123',
      active: true,
      name: 'Pizza Carbonara',
      category: 'PIZZA',
      variants: [{ id: 'v1', active: true }],
      pizzaConfig: { allowCustomization: true }
    })

    findManyMock.mockResolvedValue([{ id: 99, available: true }])

    const items = [{
      productId: '123',
      variantId: 'v1',
      quantity: 1,
      customIngredients: [{ ingredientId: 99, action: 'ADD' }]
    }] as any

    await expect(validateProducts(items)).resolves.not.toThrow()
  })
})

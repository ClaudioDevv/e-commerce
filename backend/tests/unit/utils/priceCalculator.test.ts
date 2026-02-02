import { Decimal } from 'decimal.js'
import { Ingredient, Product, ProductVariant } from '../../../src/generated/prisma'
import { calculateCartItemPrice } from '../../../src/utils/priceCalculator'

test('Un solo producto', () => {
  const product = {
    basePrice: new Decimal(10)
  } as Product

  const result = calculateCartItemPrice(product, null, [])

  expect(result.toNumber()).toBe(10)
})

test('Producto y variante', () => {
  const product = {
    basePrice: new Decimal(10)
  } as Product

  const variant = {
    priceDelta: new Decimal(4)
  } as ProductVariant

  const result = calculateCartItemPrice(product, variant, [])

  expect(result.toNumber()).toBe(14)
})

test('Producto, variante e ingrediente', () => {
  const product = {
    basePrice: new Decimal(10)
  } as Product

  const variant = {
    priceDelta: new Decimal(4)
  } as ProductVariant

  const ingredients = [
    { extraPrice: new Decimal(1) },
    { extraPrice: new Decimal(2) }
  ] as Ingredient []

  const result = calculateCartItemPrice(product, variant, ingredients)

  expect(result.toNumber()).toBe(17)
})

test('Producto y variante con descuento', () => {
  const product = {
    basePrice: new Decimal(10)
  } as Product

  const variant = {
    priceDelta: new Decimal(-2)
  } as ProductVariant

  const result = calculateCartItemPrice(product, variant, [])

  expect(result.toNumber()).toBe(8)
})

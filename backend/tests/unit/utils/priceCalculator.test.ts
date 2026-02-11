import { Decimal } from 'decimal.js'
import { calculateCartItemPrice } from '../../../src/utils/priceCalculator'

test('Un solo producto', () => {
  const basePrice = new Decimal(10)

  const result = calculateCartItemPrice(basePrice, null, [])

  expect(result.toNumber()).toBe(10)
})

test('Producto y variante', () => {
  const basePrice = new Decimal(10)

  const priceDelta = new Decimal(4)

  const result = calculateCartItemPrice(basePrice, priceDelta, [])

  expect(result.toNumber()).toBe(14)
})

test('Producto, variante e ingrediente', () => {
  const basePrice = new Decimal(10)

  const priceDelta = new Decimal(4)

  const ingredients = [
    { extraPrice: new Decimal(1) },
    { extraPrice: new Decimal(2) }
  ]

  const result = calculateCartItemPrice(basePrice, priceDelta, ingredients)

  expect(result.toNumber()).toBe(17)
})

test('Producto y variante con descuento', () => {
  const basePrice = new Decimal(10)

  const priceDelta = new Decimal(-2)

  const result = calculateCartItemPrice(basePrice, priceDelta, [])

  expect(result.toNumber()).toBe(8)
})

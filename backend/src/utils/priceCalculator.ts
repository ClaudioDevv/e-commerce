import { Decimal } from '@prisma/client/runtime/library'
import { Product, ProductVariant, Ingredient } from '../generated/prisma'

export const calculateCartItemPrice = (
  product: Product,
  variant: ProductVariant | null,
  addedIngredients: Ingredient[]
): Decimal => {
  let price = new Decimal(product.basePrice)

  if (variant) {
    price = price.add(variant.priceDelta)
  }

  for (const ingredient of addedIngredients) {
    price = price.add(ingredient.extraPrice)
  }

  return price
}

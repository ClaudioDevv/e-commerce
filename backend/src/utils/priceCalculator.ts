import { Product, ProductVariant, Ingredient } from '../generated/prisma'

export const calculateCartItemPrice = (
  product: Product,
  variant: ProductVariant | null,
  addedIngredients: Ingredient[]
): number => {
  let price = product.basePrice

  if (variant) {
    price += variant.priceDelta
  }

  for (const ingredient of addedIngredients) {
    price += ingredient.extraPrice
  }

  return price
}

import { Decimal } from 'decimal.js'

type HasExtraPrice = {
  extraPrice: Decimal;
}

export const calculateCartItemPrice = (
  basePrice: Decimal,
  priceDelta: Decimal | null,
  addedCustomizables: HasExtraPrice[]
): Decimal => {
  let price = new Decimal(basePrice)

  if (priceDelta) {
    price = price.add(priceDelta)
  }

  for (const customizable of addedCustomizables) {
    price = price.add(customizable.extraPrice)
  }

  return price
}

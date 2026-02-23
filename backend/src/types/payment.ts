import { Prisma } from '../generated/prisma'

export type OrderForStripeCheckout = {
  id: string
  userId: string | null
  status: string
  deliveryFee: Prisma.Decimal
  payment: {
    provider: string
  } | null
  items: Array<{
    nameSnapshot: string
    unitPrice: Prisma.Decimal
    quantity: number
  }>
}

import { Customizable, Product, ProductVariant } from '../generated/prisma'
import { CustomizationInput } from './cart'

export interface TimeSlot {
  time: string
  available: boolean
  estimatedDelivery?: Date
}

export type ItemWithPrice = {
  productId: string
  product: Product
  variantId?: string | null
  variant?: ProductVariant | null
  quantity: number
  notes?: string | null
  customizations: Array<{
    customizableId: number
    customizable: Customizable
    action: 'ADD' | 'REMOVE'
  }>
}

export interface GuestOrderItem {
  productId: string
  variantId?: string
  quantity: number
  notes?: string
  customizations?: CustomizationInput[]
}

export interface OrderFilters {
  status?: string
  dateFrom?: string
  dateTo?: string
  page: number
  limit: number
}

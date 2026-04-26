export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'CONFIRMED'
  | 'READY'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED'

export type DeliveryType = 'DELIVERY' | 'PICKUP'

// Shape que devuelve getAllOrders (incluye items completos)
export interface OrderFromApi {
  id: string
  status: OrderStatus
  deliveryType: DeliveryType
  customerName: string
  customerPhone: string
  subtotal: string
  deliveryFee: string
  total: string
  createdAt: string
  updatedAt: string
  scheduledFor?: string
  estimatedTime?: string
  deliveryStreet?: string
  deliveryCity?: string
  deliveryPostalCode?: string
  deliveryInstructions?: string
  isGuest: boolean
  items: OrderItemApi[]
  payment: PaymentApi | null
  address: AddressApi | null
}

export interface OrderItemApi {
  id: string
  nameSnapshot: string
  variantSnapshot?: string
  notesSnapshot?: string
  unitPrice: string
  quantity: number
  subtotal: string
  customizations: OrderItemCustomizationApi[]
}

export interface OrderItemCustomizationApi {
  customizableId: number
  action: 'ADD' | 'REMOVE'
  nameSnapshot: string
  priceSnapshot: string
}

export interface PaymentApi {
  id: string
  provider: string
  status: string
}

export interface AddressApi {
  id: string
  label: string
  street: string
  city: string
  postalCode: string
  province: string
  instructions?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalpages: number
}

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badgeClass: string }
> = {
  PENDING:    { label: 'Pendiente',  badgeClass: 'badge-pending'   },
  PAID:       { label: 'Pagado',     badgeClass: 'badge-paid'      },
  CONFIRMED:  { label: 'Confirmado', badgeClass: 'badge-confirmed' },
  READY:      { label: 'Listo',      badgeClass: 'badge-ready'     },
  ON_THE_WAY: { label: 'En camino',  badgeClass: 'badge-ontheway'  },
  DELIVERED:  { label: 'Entregado',  badgeClass: 'badge-delivered' },
  CANCELLED:  { label: 'Cancelado',  badgeClass: 'badge-cancelled' },
}

export const BADGE_STYLES: Record<string, string> = {
  'badge-pending':   'bg-amber-50  text-amber-800',
  'badge-paid':      'bg-blue-50   text-blue-800',
  'badge-confirmed': 'bg-blue-50   text-blue-800',
  'badge-ready':     'bg-orange-50 text-orange-800',
  'badge-ontheway':  'bg-violet-50 text-violet-800',
  'badge-delivered': 'bg-green-50  text-green-800',
  'badge-cancelled': 'bg-red-50    text-red-800',
}

export const DOT_STYLES: Record<string, string> = {
  'badge-pending':   'bg-amber-400',
  'badge-paid':      'bg-blue-400',
  'badge-confirmed': 'bg-blue-400',
  'badge-ready':     'bg-orange-400',
  'badge-ontheway':  'bg-violet-400',
  'badge-delivered': 'bg-green-500',
  'badge-cancelled': 'bg-red-400',
}

export function buildItemsSummary(items: OrderItemApi[]): string {
  return items.map(i => `${i.quantity > 1 ? `${i.quantity}× ` : ''}${i.nameSnapshot}`).join(', ')
}

export function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
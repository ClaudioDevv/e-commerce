import Link from 'next/link'
import { ArrowRight, Bike, Store } from 'lucide-react'
import {
  type OrderFromApi,
  STATUS_CONFIG,
  BADGE_STYLES,
  DOT_STYLES,
  buildItemsSummary,
  formatOrderDate,
} from '@/types/order'

interface Props {
  order: OrderFromApi
}

export default function OrderCard({ order }: Props) {
  const { label, badgeClass } = STATUS_CONFIG[order.status]
  const isDelivery = order.deliveryType === 'DELIVERY'
  const summary = buildItemsSummary(order.items)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between px-5 pt-4 pb-3">
        <div className="flex flex-col gap-1.5">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${BADGE_STYLES[badgeClass]}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_STYLES[badgeClass]}`} />
            {label}
          </span>
          <span className="text-xs text-gray-400">{formatOrderDate(order.createdAt)}</span>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span className="font-serif text-lg font-semibold text-gray-900">
            {parseFloat(order.total).toFixed(2)} €
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            {isDelivery ? <Bike size={12} /> : <Store size={12} />}
            {isDelivery ? 'A domicilio' : 'Recogida en tienda'}
          </span>
        </div>
      </div>

      <hr className="border-gray-100 mx-5" />

      <div className="flex items-center justify-between px-5 py-2.5">
        <span className="text-xs text-gray-400 truncate pr-4">{summary}</span>
        <Link
          href={`/secure/orders/${order.id}`}
          className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-500 transition-colors shrink-0 group"
        >
          Ver pedido
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
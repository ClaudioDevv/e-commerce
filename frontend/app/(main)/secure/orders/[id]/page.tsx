import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Bike, Store, MapPin, Clock } from 'lucide-react'
import { orderServerApi } from '@/app/lib/api/orders.server'
import {
  type OrderFromApi,
  STATUS_CONFIG,
  BADGE_STYLES,
  DOT_STYLES,
  formatOrderDate,
} from '@/types/order'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let order: OrderFromApi

  try {
    const res = await orderServerApi.getById(id)
    order = res.data as unknown as OrderFromApi
  } catch {
    notFound()
  }

  const { label, badgeClass } = STATUS_CONFIG[order.status]
  const isDelivery = order.deliveryType === 'DELIVERY'

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/secure/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Mis pedidos
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-1">
            Pedido #{order.id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-400">{formatOrderDate(order.createdAt)}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${BADGE_STYLES[badgeClass]}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_STYLES[badgeClass]}`} />
          {label}
        </span>
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3 border-b border-gray-100">
          Productos
        </p>
        <div className="divide-y divide-gray-100">
          {order.items.map(item => (
            <div key={item.id} className="px-5 py-3.5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.quantity}× {item.nameSnapshot}
                    {item.variantSnapshot && (
                      <span className="text-gray-400 font-normal text-xs ml-1.5">
                        ({item.variantSnapshot})
                      </span>
                    )}
                  </p>
                  {item.customizations.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {item.customizations.map((c, i) => (
                        <li key={i} className="text-xs text-gray-400">
                          {c.action === 'ADD' ? '+' : '−'} {c.nameSnapshot}
                          {parseFloat(c.priceSnapshot) > 0 && (
                            <span> (+{parseFloat(c.priceSnapshot).toFixed(2)} €)</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.notesSnapshot && (
                    <p className="text-xs text-gray-400 italic mt-1">{item.notesSnapshot}</p>
                  )}
                </div>
                <span className="text-sm text-gray-600 ml-4 shrink-0">
                  {parseFloat(item.subtotal).toFixed(2)} €
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desglose */}
        <div className="border-t border-gray-100 px-5 py-3.5 space-y-1.5 bg-gray-50">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{parseFloat(order.subtotal).toFixed(2)} €</span>
          </div>
          {isDelivery && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>Gastos de envío</span>
              <span>
                {parseFloat(order.deliveryFee) === 0
                  ? 'Gratis'
                  : `${parseFloat(order.deliveryFee).toFixed(2)} €`}
              </span>
            </div>
          )}
          <div className="flex justify-between font-serif text-base font-semibold text-gray-900 pt-1 border-t border-gray-200">
            <span>Total</span>
            <span>{parseFloat(order.total).toFixed(2)} €</span>
          </div>
        </div>
      </div>

      {/* Entrega */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3 border-b border-gray-100">
          Entrega
        </p>
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            {isDelivery
              ? <Bike size={15} className="text-gray-400" />
              : <Store size={15} className="text-gray-400" />}
            {isDelivery ? 'A domicilio' : 'Recogida en tienda'}
          </div>

          {isDelivery && order.deliveryStreet && (
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin size={15} className="text-gray-400 mt-0.5 shrink-0" />
              <span>
                {order.deliveryStreet}, {order.deliveryPostalCode} {order.deliveryCity}
                {order.deliveryInstructions && (
                  <span className="block text-xs text-gray-400 mt-0.5">
                    {order.deliveryInstructions}
                  </span>
                )}
              </span>
            </div>
          )}

          {order.scheduledFor && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock size={15} className="text-gray-400" />
              Programado para las{' '}
              {new Date(order.scheduledFor).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
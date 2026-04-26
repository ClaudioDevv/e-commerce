'use client'

import { useState, useEffect, useCallback } from 'react'
import { orderApi } from '@/app/lib/api/orders'
import OrderCard from './OrderCard'
import { type OrderFromApi, type OrderStatus, type PaginationMeta } from '@/types/order'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type FilterKey = 'all' | 'active' | 'delivered' | 'cancelled'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'Todos'      },
  { key: 'active',    label: 'En curso'   },
  { key: 'delivered', label: 'Entregados' },
  { key: 'cancelled', label: 'Cancelados' },
]

const ACTIVE_STATUSES = new Set<OrderStatus>(['PENDING', 'PAID', 'CONFIRMED', 'READY', 'ON_THE_WAY'])

function matchesFilter(order: OrderFromApi, filter: FilterKey) {
  if (filter === 'all')       return true
  if (filter === 'active')    return ACTIVE_STATUSES.has(order.status)
  if (filter === 'delivered') return order.status === 'DELIVERED'
  if (filter === 'cancelled') return order.status === 'CANCELLED'
  return true
}

export default function OrderManager() {
  const [orders, setOrders]       = useState<OrderFromApi[]>([])
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [isLoading, setLoading]   = useState(true)
  const [error, setError]         = useState('')
  const [filter, setFilter]       = useState<FilterKey>('all')
  const [page, setPage]           = useState(1)

  const loadOrders = useCallback(async (p: number) => {
    try {
      setLoading(true)
      const res = await orderApi.getAll({ page: p })
      setOrders(res.data as unknown as OrderFromApi[])
      setPagination(res.pagination as unknown as PaginationMeta)
    } catch {
      setError('Error al cargar el historial de pedidos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders(page)
  }, [page, loadOrders])

  // Resetear filtro al cambiar de página
  function handlePageChange(next: number) {
    setFilter('all')
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
        {error}
      </div>
    )
  }

  const filtered = orders.filter(o => matchesFilter(o, filter))

  return (
    <>
      {orders.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs px-4 py-1.5 rounded-full border transition-colors ${
                filter === f.key
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🍕</p>
          <p className="font-serif text-lg text-gray-900 mb-1">Nada por aquí todavía</p>
          <p className="text-sm text-gray-400">Tus pedidos aparecerán aquí una vez que realices uno.</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No hay pedidos en esta categoría.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Paginación — solo si hay más de una página y no hay filtro activo */}
      {pagination && pagination.totalpages > 1 && filter === 'all' && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-sm text-gray-500">
            Página {page} de {pagination.totalpages}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pagination.totalpages}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  )
}
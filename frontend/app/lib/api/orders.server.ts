import { OrderFromApi } from '@/types/order'
import { serverFetch } from './serverFetch'

type OrderResponse = {
  success: boolean
  data: OrderFromApi
}

export const orderServerApi = {
  async getById(id: string): Promise<OrderResponse> {
    const response = await serverFetch(`/api/orders/${id}`)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Error al obtener el pedido')
    }

    return result
  }
}
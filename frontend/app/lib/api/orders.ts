import { clientFetch } from './clientFetch'
import { OrderFromApi } from '@/types/order'

const API_URL = process.env.API_URL || 'http://localhost:3001'

type AllOrdersReponse = {
  success: boolean
  data: OrderFromApi[]
  pagination: {
    page: number
    limit: number
    total: number
    totalpages: number
  }
}


export const orderApi = {
  async getAll({page}: {page: number}): Promise<AllOrdersReponse> {
    const response = await clientFetch(`${API_URL}/api/orders?page=${page}`)

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Error al obtener pedidos')
    }

    return result
  }
}
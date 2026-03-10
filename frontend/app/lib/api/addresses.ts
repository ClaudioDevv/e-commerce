import { fetchWithAuth } from './fetchWithAuth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface AddressPayload {
  label?: string
  street: string
  city: string
  postalCode: string
  province?: string
  instructions?: string
  isDefault?: boolean
}

export interface Address extends AddressPayload {
  id: string
}

interface AddressResponse {
  success: boolean
  data: Address[]
  count: number
}

export const addressApi = {
  async get(): Promise<AddressResponse> {
    const response = await fetchWithAuth(`${API_URL}/api/addresses/`, {
      method: 'GET',
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'No se han podido obtener direcciones')
    }

    return result
  },

  async create(data: AddressPayload) {
    const response = await fetchWithAuth(`${API_URL}/api/addresses`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.message || 'Error al crear dirección')
    }

    return result
  },

  async update(id: string, data: AddressPayload) {
    const response = await fetchWithAuth(`${API_URL}/api/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'Error al actualizar dirección')
    }

    return result
  },

   async setDefault(id: string) {
    const response = await fetchWithAuth(`${API_URL}/api/addresses/${id}/default`, {
      method: 'PATCH',
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'Error al actualizar dirección')
    }

    return result
  },

  async delete(id: string) {
    const response = await fetchWithAuth(`${API_URL}/api/addresses/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'Error al eliminar dirección')
    }

    return result
  },
}
import { clientFetch } from './clientFetch'

const API_URL = process.env.API_URL || 'http://localhost:3001'

interface AddressPayload {
  label?: string
  street: string
  city: string
  postalCode: string
  province: string
  instructions?: string
  isDefault?: boolean
}

export interface Address extends AddressPayload {
  id: string
}

interface AddressListResponse {
  success: boolean
  data: Address[]
  count: number
}

interface AddressSingleResponse {
  success: boolean
  message: string
  data: Address
}

export const addressApi = {
  async get(): Promise<AddressListResponse> {
    const response = await clientFetch(`${API_URL}/api/addresses/`)

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'No se han podido obtener direcciones')
    }

    return result
  },

  async create(data: AddressPayload): Promise<AddressSingleResponse> {
    const response = await clientFetch(`${API_URL}/api/addresses`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.message || 'Error al crear dirección')
    }

    return result
  },

  async update(id: string, data: AddressPayload): Promise<AddressSingleResponse> {
    const response = await clientFetch(`${API_URL}/api/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'Error al actualizar dirección')
    }

    return result
  },

   async setDefault(id: string): Promise<AddressSingleResponse> {
    const response = await clientFetch(`${API_URL}/api/addresses/${id}/default`, {
      method: 'PATCH',
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'Error al actualizar dirección')
    }

    return result
  },

  async delete(id: string): Promise<{success: boolean, message: string}> {
    const response = await clientFetch(`${API_URL}/api/addresses/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'Error al eliminar dirección')
    }

    return result
  },
}
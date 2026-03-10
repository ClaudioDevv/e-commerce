import { fetchWithAuth } from './fetchWithAuth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'


interface LoginData {
  email: string,
  password: string
}

interface RegisterData extends LoginData{
  name: string
  surname: string
  phone: string
}

interface UpdateUserData {
  name: string,
  surname: string,
  phone: string
}

interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: string
      email: string
      name: string
      surname: string
      phone: string
      role: string
    }
    accessToken: string
  }
}

export const authApi = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Error al registrar usuario')
    }

    return result
  },
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Error al iniciar sesión')
    }

    return result
  },
  async me(): Promise<AuthResponse> {
    const response = await fetchWithAuth(`${API_URL}/api/auth/me`, {
      method: 'GET',
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || 'No autenticado')
    }

    return result
  },
  async updateUser(data: UpdateUserData){
    const response = await fetchWithAuth(`${API_URL}/api/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Error al actualizar usuario')
    }

    return result
  },
  async logout(): Promise<void> {
    const response = await fetchWithAuth(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Error al cerrar sesión')
    }

    return result
  }
}
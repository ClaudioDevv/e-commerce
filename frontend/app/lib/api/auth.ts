import { clientFetch } from './clientFetch'

const API_URL = process.env.API_URL || 'http://localhost:3001'
// const AUTH_BASE = '/api/auth'

export interface User {
  id: string
  email: string
  name: string
  surname: string
  phone: string
  role: string
}

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
    user: User
  }
}

interface LogoutResponse {
  success: boolean,
  message: string
}


export const authApi = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
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
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Error al iniciar sesión')
    }

    return result
  },

  async me(): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('No autenticado')
    }

    return response.json()
  },

  async updateUser(data: UpdateUserData): Promise<AuthResponse> {
    const response = await clientFetch(`${API_URL}/api/auth/me`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Error al actualizar usuario')
    }

    return result
  },

  async logout(): Promise<LogoutResponse> {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
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
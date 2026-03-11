'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/app/lib/api/auth'
import { useSearchParams } from 'next/navigation'
import type { User } from '@/app/lib/api/auth'

interface RegisterData {
  email: string
  password: string
  name: string
  surname: string
  phone: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    checkAuth()
  }, [])


  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      window.history.replaceState({}, '', '/')
      setUser(null)
      setIsLoading(false)
    }
  }, [searchParams])

  async function checkAuth() {
    try {
      const response = await authApi.me()
      setUser(response.data.user)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const response = await authApi.login({ email, password })
    setUser(response.data.user)
  }

  async function register(data: RegisterData) {
    const response = await authApi.register(data)
    setUser(response.data.user)
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
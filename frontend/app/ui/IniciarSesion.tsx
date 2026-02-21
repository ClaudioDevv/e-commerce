'use client'

import { useState, useEffect } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { authApi } from '@/app/lib/api/auth'

interface InicioSesionProps {
  isOpen: boolean
  onClose: () => void
  onGoToRegister: () => void
}

export default function IniciarSesion({ isOpen, onClose, onGoToRegister }: InicioSesionProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  function clearError(field: string) {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  // Bloquea el scroll mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!isOpen) return null

  function validate() {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Introduce un email válido'
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const response = await authApi.login({
        email,
        password
      })

      console.log('Inicio de sesión exitoso:', response)

      setEmail('')
      setPassword('')
      setRememberMe(false)

      onClose()
    } catch (error) {
      if(error instanceof Error){
        if(error.message.includes('no existe')) {
          setErrors({ email: 'Este email no está registrado o inactivo' })
        } else if(error.message.includes('incorrecta')) {
          setErrors({ password: 'Contraseña incorrecta' })
        } else {
          setErrors({ general: error.message })
        }
      } else {
        setErrors({ general: 'Error al crear la cuenta. Intenta de nuevo.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed top-px inset-x-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white w-full max-w-sm rounded-2xl shadow-xl px-8 py-6 animate-scale-in"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-gray-900 font-semibold text-3xl leading-snug pr-4">
              Hazte miembro y pide más rápido
            </h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition shrink-0"
              aria-label="Cerrar"
            >
              <X size={28} />
            </button>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Tu email *
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  if (errors.email) clearError('email')
                }}
                placeholder="ejemplo@correo.com"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none transition
                  focus:ring-2 focus:ring-red-400
                  ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Tu contraseña *
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                    if (errors.password) clearError('password')
                  }}
                  placeholder="Tu contraseña"
                  className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 outline-none transition
                    focus:ring-2 focus:ring-red-400
                    ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Error y ¿olvidaste? fuera del relative, en orden correcto */}
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              <button type="button" className="text-sm text-red-500 underline self-start">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Recordarme */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="accent-red-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-gray-600">Recordarme</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-semibold py-2 rounded-full transition w-full mt-1"
            >
              {isLoading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            ¿No tienes cuenta?{' '}
            <button onClick={onGoToRegister} className="text-red-500 font-medium underline">
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'

interface RegistrarProps {
  isOpen: boolean
  onClose: () => void
  onGoToLogin: () => void
}

export default function Registrar({ isOpen, onClose, onGoToLogin }: RegistrarProps) {
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false)
  const [aceptaComunicaciones, setAceptaComunicaciones] = useState(false)
  const [aceptaPolitica, setAceptaPolitica] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  function clearError(field: string) {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!isOpen) return null

  function validate() {
    const newErrors: Record<string, string> = {}

    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (!apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios'

    if (!email) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Introduce un email válido'
    }

    if (!telefono) {
      newErrors.telefono = 'El teléfono es obligatorio'
    } else if (!/^\d{9}$/.test(telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Introduce un teléfono válido'
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres'
    }

    if (!passwordRepeat) {
      newErrors.passwordRepeat = 'Confirma tu contraseña'
    } else if (password !== passwordRepeat) {
      newErrors.passwordRepeat = 'Las contraseñas no coinciden'
    }

    if (!aceptaPolitica) {
      newErrors.aceptaPolitica = 'Debes aceptar la política de privacidad'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      console.log({ 
        nombre, apellidos, email, telefono, 
        password, aceptaComunicaciones, aceptaPolitica 
      })
      await new Promise(r => setTimeout(r, 1000))
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed top-px inset-x-0 z-50 flex justify-center items-center p-4">
        <div
          className="bg-white w-full max-w-sm max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl shadow-xl px-8 py-6 animate-scale-in"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-gray-900 font-semibold text-2xl leading-snug pr-4">
              ¡Ya casi formas parte de Bella Massa!
            </h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition shrink-0"
              aria-label="Cerrar"
            >
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Nombre */}
            <div className="flex flex-col gap-1">
              <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                Nombre *
              </label>
              <input
                id="nombre"
                type="text"
                autoComplete="given-name"
                value={nombre}
                onChange={e => {
                  setNombre(e.target.value)
                  if (errors.nombre) clearError('nombre')
                }}
                placeholder="Tu nombre"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none transition
                  focus:ring-2 focus:ring-red-400
                  ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
            </div>

            {/* Apellidos */}
            <div className="flex flex-col gap-1">
              <label htmlFor="apellidos" className="text-sm font-medium text-gray-700">
                Apellidos *
              </label>
              <input
                id="apellidos"
                type="text"
                autoComplete="family-name"
                value={apellidos}
                onChange={e => {
                  setApellidos(e.target.value)
                  if (errors.apellidos) clearError('apellidos')
                }}
                placeholder="Tus apellidos"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none transition
                  focus:ring-2 focus:ring-red-400
                  ${errors.apellidos ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.apellidos && <p className="text-xs text-red-500">{errors.apellidos}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email *
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

            {/* Teléfono */}
            <div className="flex flex-col gap-1">
              <label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                Teléfono *
              </label>
              <input
                id="telefono"
                type="tel"
                autoComplete="tel"
                value={telefono}
                onChange={e => {
                  setTelefono(e.target.value)
                  if (errors.telefono) clearError('telefono')
                }}
                placeholder="123 456 789"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none transition
                  focus:ring-2 focus:ring-red-400
                  ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.telefono && <p className="text-xs text-red-500">{errors.telefono}</p>}
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                    if (errors.password) clearError('password')
                  }}
                  placeholder="Mínimo 8 caracteres"
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
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Repetir contraseña */}
            <div className="flex flex-col gap-1">
              <label htmlFor="passwordRepeat" className="text-sm font-medium text-gray-700">
                Repetir contraseña *
              </label>
              <div className="relative">
                <input
                  id="passwordRepeat"
                  type={showPasswordRepeat ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={passwordRepeat}
                  onChange={e => {
                    setPasswordRepeat(e.target.value)
                    if (errors.passwordRepeat) clearError('passwordRepeat')
                  }}
                  placeholder="Repite tu contraseña"
                  className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 outline-none transition
                    focus:ring-2 focus:ring-red-400
                    ${errors.passwordRepeat ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordRepeat(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showPasswordRepeat ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPasswordRepeat ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.passwordRepeat && <p className="text-xs text-red-500">{errors.passwordRepeat}</p>}
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-3 mt-2">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={aceptaComunicaciones}
                  onChange={e => setAceptaComunicaciones(e.target.checked)}
                  className="accent-red-500 w-4 h-4 cursor-pointer mt-0.5 shrink-0"
                />
                <span className="text-xs text-gray-600 leading-tight">
                  Acepto recibir comunicaciones comerciales personalizadas
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={aceptaPolitica}
                  onChange={e => {
                    setAceptaPolitica(e.target.checked)
                    if (errors.aceptaPolitica) clearError('aceptaPolitica')
                  }}
                  className="accent-red-500 w-4 h-4 cursor-pointer mt-0.5 shrink-0"
                />
                <span className="text-xs text-gray-600 leading-tight">
                  He leído y acepto la{' '}
                  <a href="/politica-privacidad" target="_blank" className="text-red-500 underline">
                    Política de privacidad
                  </a>
                  {' '}y las{' '}
                  <a href="/condiciones" target="_blank" className="text-red-500 underline">
                    Condiciones generales de compra
                  </a>{' '}
                  *
                </span>
              </label>
              {errors.aceptaPolitica && <p className="text-xs text-red-500 -mt-2">{errors.aceptaPolitica}</p>}
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-semibold py-2 rounded-full transition w-full mt-2"
            >
              {isLoading ? 'Creando cuenta...' : 'CREAR CUENTA'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-5">
            ¿Ya tienes cuenta?{' '}
            <button onClick={onGoToLogin} className="text-red-500 font-medium underline">
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
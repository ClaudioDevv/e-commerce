'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import Link from 'next/link'
import { authApi } from '@/app/lib/api/auth'

export default function ProfileForm() {
  const { user, refreshUser } = useAuth()
  

  const [nombre, setNombre] = useState(user?.name || '')
  const [apellidos, setApellidos] = useState(user?.surname || '')
  const [telefono, setTelefono] = useState(user?.phone || '')
  const [email] = useState(user?.email || '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const isDirty = nombre !== user?.name || apellidos !== user?.surname || telefono !== user?.phone;

  function clearError(field: string) {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  function validate() {
    const newErrors: Record<string, string> = {}

    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (!apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios'

    if (!telefono) {
      newErrors.telefono = 'El teléfono es obligatorio'
    } else if (!/^\d{9}$/.test(telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Introduce un teléfono válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setSuccessMessage('')
    
    try {
      const response = await authApi.updateUser({name: nombre, surname: apellidos, phone: telefono})

      setSuccessMessage('Perfil actualizado')
      console.log('Usuario actualizado correctamente', response)
      await refreshUser()
      
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message })
      } else {
        setErrors({ general: 'Error al actualizar. Intenta de nuevo.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='mb-8'>
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className="flex flex-col gap-2">
          <label htmlFor="nombre" className="text-sm font-medium text-gray-800">
            Nombre *
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={e => {
              setNombre(e.target.value)
              if (errors.nombre) clearError('nombre')
            }}
            className={`w-full border rounded-lg px-4 py-3 text-gray-900 outline-none transition
              focus:ring-2 focus:ring-red-300
              ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="apellidos" className="text-sm font-medium text-gray-800">
            Apellidos *
          </label>
          <input
            id="apellidos"
            type="text"
            value={apellidos}
            onChange={e => {
              setApellidos(e.target.value)
              if (errors.apellidos) clearError('apellidos')
            }}
            className={`w-full border rounded-lg px-4 py-3 text-gray-900 outline-none transition
              focus:ring-2 focus:ring-red-300
              ${errors.apellidos ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.apellidos && <p className="text-xs text-red-500">{errors.apellidos}</p>}
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-2">
          <label htmlFor="telefono" className="text-sm font-medium text-gray-800">
            Número de teléfono *
          </label>
          <input
            id="telefono"
            type="tel"
            value={telefono}
            onChange={e => {
              setTelefono(e.target.value)
              if (errors.telefono) clearError('telefono')
            }}
            placeholder="123 456 789"
            className={`w-full border rounded-lg px-4 py-3 text-gray-900 outline-none transition
              focus:ring-2 focus:ring-red-300
              ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.telefono && <p className="text-xs text-red-500">{errors.telefono}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Correo electrónico *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            disabled
            className={`w-full border rounded-lg px-4 py-3 text-gray-900 bg-gray-200 outline-none transition
              focus:ring-2 focus:ring-red-400`}
          />
        </div>

        {/* Comunicaciones */}
        <div className="pt-4">
          <h2 className="font-semibold text-gray-700 mb-4">
            Comunicaciones y gestión de datos
          </h2>
          
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={true}
              disabled
              className="accent-red-500 w-5 h-5 cursor-pointer mt-0.5 shrink-0"
            />
            <span className="text-sm text-gray-400 leading-relaxed">
              He leído y acepto la{' '}
              <Link 
                href="/politica-privacidad" 
                target="_blank" 
                className="text-red-500 underline hover:text-red-600"
              >
                Política de privacidad
              </Link>
              {' '}y las{' '}
              <Link 
                href="/condiciones" 
                target="_blank" 
                className="text-red-500 underline hover:text-red-600"
              >
                Condiciones generales de compra
              </Link>
            </span>
          </label>
        </div>


        <div className='flex justify-center'>
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-bold py-3 px-15 rounded-full transition mt-4"
          >
            {isLoading ? 'GUARDANDO...' : 'GUARDAR'}
          </button>
        </div>
      </form>
    </section>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { addressApi } from '@/app/lib/api/addresses'

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

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  address?: Address | null
  numAddresses: number
}

export default function AddressModal({ isOpen, onClose, onSave, address, numAddresses }: AddressModalProps) {
  const [label, setLabel] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [province, setProvince] = useState('')
  const [instructions, setInstructions] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      
      // Si hay dirección, es edición
      if (address) {
        setLabel(address.label || '')
        setStreet(address.street)
        setCity(address.city)
        setPostalCode(address.postalCode)
        setProvince(address.province || '')
        setInstructions(address.instructions || '')
        setIsDefault(address.isDefault || false)
      } else {
        // Reset para nueva dirección
        resetForm()
      }
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, address])

  function resetForm() {
    setLabel('')
    setStreet('')
    setCity('')
    setPostalCode('')
    setProvince('')
    setInstructions('')
    setIsDefault(false)
    setErrors({})
  }

  function clearError(field: string) {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  function validate() {
    const newErrors: Record<string, string> = {}

    if (!street.trim()) newErrors.street = 'La calle es obligatoria'
    if (!city.trim()) newErrors.city = 'La ciudad es obligatoria'
    if (!province.trim()) newErrors.province = 'La provincia es obligatoria'
    
    if (!postalCode.trim()) {
      newErrors.postalCode = 'El código postal es obligatorio'
    } else if (!/^\d{5}$/.test(postalCode)) {
      newErrors.postalCode = 'Código postal inválido (5 dígitos)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const data: AddressPayload  = {
        street,
        city,
        postalCode,
      }

      if (label.trim()) data.label = label.trim()
      if (province.trim()) data.province = province.trim()
      if (instructions.trim()) data.instructions = instructions.trim()
      if (isDefault) data.isDefault = isDefault

      if (address?.id) {
        await Promise.all([
          addressApi.update(address.id, data),
          isDefault ? addressApi.setDefault(address.id) : Promise.resolve()
        ])
        await addressApi.update(address.id, data)
      } else {
        await addressApi.create(data)
      }

      resetForm()
      onSave()
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white w-full max-w-lg rounded-2xl shadow-xl px-8 py-6 my-8 animate-scale-in"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {address ? 'Editar dirección' : 'Añadir nueva dirección'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition shrink-0"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Calle */}
            <div className="flex flex-col gap-1">
              <label htmlFor="street" className="text-sm font-medium text-gray-700">
                Calle y número *
              </label>
              <input
                id="street"
                type="text"
                value={street}
                onChange={e => {
                  setStreet(e.target.value)
                  if (errors.street) clearError('street')
                }}
                placeholder="Calle Principal, 123, 4ºB"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none transition
                  focus:ring-2 focus:ring-red-400
                  ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.street && <p className="text-xs text-red-500">{errors.street}</p>}
            </div>
            
            {/* Etiqueta */}
            <div className="flex flex-col gap-1">
              <label htmlFor="label" className="text-sm font-medium text-gray-700">
                Etiqueta
              </label>
              <input
                id="label"
                type="text"
                value={label}
                onChange={e => {
                  setLabel(e.target.value)
                  if (errors.label) clearError('label')
                }}
                placeholder="Casa, Trabajo, Oficina..."
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none transition
                  focus:ring-2 focus:ring-red-400
                  ${errors.label ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.label && <p className="text-xs text-red-500">{errors.label}</p>}
            </div>

            

            {/* CP y Ciudad */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                  Código postal *
                </label>
                <input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={e => {
                    setPostalCode(e.target.value)
                    if (errors.postalCode) clearError('postalCode')
                  }}
                  placeholder="28001"
                  maxLength={5}
                  className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none transition
                    focus:ring-2 focus:ring-red-400
                    ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.postalCode && <p className="text-xs text-red-500">{errors.postalCode}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="city" className="text-sm font-medium text-gray-700">
                  Ciudad *
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={e => {
                    setCity(e.target.value)
                    if (errors.city) clearError('city')
                  }}
                  placeholder="Madrid"
                  className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none transition
                    focus:ring-2 focus:ring-red-400
                    ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
              </div>
            </div>

            {/* Provincia */}
            <div className="flex flex-col gap-1">
              <label htmlFor="province" className="text-sm font-medium text-gray-700">
                Provincia *
              </label>
              <input
                id="province"
                type="text"
                value={province}
                onChange={e => {
                  setProvince(e.target.value)
                  if (errors.province) clearError('province')
                }}
                placeholder="Madrid"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none transition
                  focus:ring-2 focus:ring-red-400
                  ${errors.province ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.province && <p className="text-xs text-red-500">{errors.province}</p>}
            </div>

            {/* Instrucciones */}
            <div className="flex flex-col gap-1">
              <label htmlFor="instructions" className="text-sm font-medium text-gray-700">
                Instrucciones de entrega (opcional)
              </label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="Timbre 4B, dejar en portería..."
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 
                  outline-none transition focus:ring-2 focus:ring-red-400 resize-none"
              />
            </div>

            {/* Dirección por defecto */}
            {numAddresses !== 0 ?
              (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={e => setIsDefault(e.target.checked)}
                    className="accent-red-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Establecer como dirección por defecto</span>
                </label>

              ) : (<></>)
            }

            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-semibold py-3 rounded-full transition w-full mt-2"
            >
              {isLoading ? 'Guardando...' : 'GUARDAR'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
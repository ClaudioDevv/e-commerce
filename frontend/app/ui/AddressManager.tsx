'use client'

import { useState, useEffect } from 'react'
import { addressApi } from '@/app/lib/api/addresses'
import AddressCard from './AddressCard'
import AddressModal from './AddressModal'
import DeleteAddressModal from './DeleteAddressModal'
import { Plus } from 'lucide-react'

interface Address {
  id: string
  label: string
  street: string
  city: string
  postalCode: string
  province: string
  instructions?: string
  isDefault: boolean
}

export default function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAddresses()
  }, [])

  async function loadAddresses() {
    try {
      setIsLoading(true)
      const response = await addressApi.get()
      setAddresses(response.data as unknown as Address[])
    } catch (err) {
      setError('Error al cargar direcciones')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  function handleAddNew() {
    setEditingAddress(null)
    setIsModalOpen(true)
  }

  function handleEdit(address: Address) {
    setEditingAddress(address)
    setIsModalOpen(true)
  }

  function handleDeleteRequest(id: string) {
    setDeletingAddressId(id)
    setIsDeleteModalOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!deletingAddressId) return

    try {
      await addressApi.delete(deletingAddressId)
      await loadAddresses()
    } catch {
      alert('Error al eliminar la dirección')
    } finally {
      setIsDeleteModalOpen(false)
      setDeletingAddressId(null)
    }
  }

  function handleDeleteCancel() {
    setIsDeleteModalOpen(false)
    setDeletingAddressId(null)
  }

  async function handleSave() {
    setIsModalOpen(false)
    await loadAddresses()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
        {error}
      </div>
    )
  }

  return (
    <>
      {addresses.length === 0 ? (
        <div>
          <p className="text-gray-500 mb-6">No tienes direcciones guardadas aún</p>
            <button
              onClick={handleAddNew}
              className="flex justify-start items-center gap-1 font-semibold text-red-500 underline py-3 rounded-full transition"
            >
              <Plus size={20} />
              Añadir dirección
            </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map(address => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDeleteRequest(address.id)}
            />
          ))}

          <button
              onClick={handleAddNew}
              className="flex justify-start items-center gap-1 font-semibold text-red-500 underline py-3 rounded-full transition"
            >
              <Plus size={20} />
              Añadir dirección
            </button>
        </div>
      )}

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        address={editingAddress}
        numAddresses={addresses.length}
      />

      <DeleteAddressModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
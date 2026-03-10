import { MapPin, Pencil, Trash2, Star } from 'lucide-react'

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

interface AddressCardProps {
  address: Address
  onEdit: () => void
  onDelete: () => void
}

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <div className="border border-gray-400 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-red-600 shrink-0" />
          <h3 className="font-semibold text-gray-900">{address.label}</h3>
          {address.isDefault && (
            <Star size={18} className="text-yellow-500 fill-yellow-500" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-900 hover:text-red-500 hover:bg-gray-50 rounded-lg transition"
            aria-label="Editar dirección"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-900 hover:text-red-500 hover:bg-gray-50 rounded-lg transition"
            aria-label="Eliminar dirección"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="text-gray-800 space-y-1">
        <p>{address.street}</p>
        <p>
          {address.postalCode} {address.city}, {address.province}
        </p>
        {address.instructions && (
          <p className="text-gray-500 italic mt-2">
            <span className="font-medium">Instrucciones:</span> {address.instructions}
          </p>
        )}
      </div>
    </div>
  )
}
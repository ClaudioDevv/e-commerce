import { X } from 'lucide-react'

interface DeleteAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteAddressModal({ isOpen, onClose, onConfirm }: DeleteAddressModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40"/>

      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div
          className="flex flex-col justify-center items-center gap-5 bg-white w-full max-w-sm rounded-2xl shadow-xl px-8 py-6 animate-scale-in"
        >
        <div className="flex justify-between items-start gap-1.5 mb-4">
          <h2 className='text-2xl font-bold text-gray-900'>¿Seguro que quieres eliminar esta dirección?</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-800 transition'>
            <X size={30} />
          </button>
        </div>

        <button onClick={onConfirm} className='bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-bold py-3 px-15 rounded-full transition mt-4'>
          CONFIRMAR
        </button>

        </div>
      </div>
    </>
  )

}
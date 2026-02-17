'use client'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 z-10"
        onClick={onClose}
      />

      <div className="fixed z-20 flex items-center justify-center right-16 pt-11">
        <div 
          className="bg-white w-full max-w-xs rounded-2xl shadow-xl px-8 py-4 animate-scale-in"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col gap-4 border-b border-gray-800 py-4">
            <button className="bg-red-500 text-white py-1 px-6 rounded-full transition">
              INICIAR SESIÓN
            </button>

            <button className="border border-red-500 text-red-500 py-0.5 px-6 rounded-full transition">
              REGÍSTRATE
            </button>
          </div>

          <h2 className="text-gray-800 text-center mt-4">
            HAZTE MIEMBRO!
          </h2>
        </div>
      </div>
    </>
  )
}
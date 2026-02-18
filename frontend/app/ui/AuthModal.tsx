'use client'

import { useState } from 'react'
import IniciarSesion from './IniciarSesion'
import Registrar from './Registrar'

type ActiveModal = 'menu' | 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeModal, setActiveModal] = useState<ActiveModal>('menu')

  if (!isOpen) return null

  function handleClose() {
    onClose()
    setActiveModal('menu')
  }

  if (activeModal === 'login') {
    return (
      <IniciarSesion
        isOpen={true}
        onClose={handleClose}
        onGoToRegister={() => setActiveModal('register')}
      />
    )
  }

  if (activeModal === 'register') {
    return (
      <Registrar
        isOpen={true}
        onClose={handleClose}
        onGoToLogin={() => setActiveModal('login')}
      />
    )
  }

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
            <button
              onClick={() => setActiveModal('login')}
              className="bg-red-500 text-white py-1 px-6 rounded-full transition"
            >
              INICIAR SESIÓN
            </button>

            <button
              onClick={() => setActiveModal('register')}
              className="border border-red-500 text-red-500 py-0.5 px-6 rounded-full transition"
            >
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
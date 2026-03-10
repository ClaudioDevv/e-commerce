'use client'

import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingCartIcon, User2Icon, LogOutIcon } from 'lucide-react'

interface PerfilModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PerfilModal({ isOpen, onClose }: PerfilModalProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  if (!isOpen) return null

  async function handleLogout() {
    await logout()
    onClose()
    router.push('/')
  }

  const isOrdersActive = pathname === '/secure/orderhistory'
  const isProfileActive = pathname === '/secure/myprofile'

  return (
    <>
      <div
        className="fixed inset-0 z-10"
        onClick={onClose}
      />

      <aside className="fixed z-20 flex items-center justify-center right-16 pt-9">
        <div
          className="bg-white rounded-2xl shadow-xl overflow-hidden animate-scale-in"
          onClick={e => e.stopPropagation()}
        >

          <header className="bg-red-500 text-white px-6 py-5 text-left font-bold">
            ¡HOLA {user?.name?.toUpperCase()}!
          </header>

          <nav className="flex flex-col divide-y divide-gray-200">
            
            <Link
              href="/secure/orderhistory"
              onClick={onClose}
              className={`
                flex items-center gap-3 px-6 py-4 font-medium transition
                hover:bg-gray-50
                ${isOrdersActive ? 'text-red-500' : 'text-gray-800'}
              `}
            >
              <ShoppingCartIcon />
              <span>HISTORIAL DE PEDIDOS</span>
            </Link>

            <Link
              href="/secure/myprofile"
              onClick={onClose}
              className={`
                flex items-center gap-3 px-6 py-4 font-medium transition
                hover:bg-gray-50
                ${isProfileActive ? 'text-red-500' : 'text-gray-800'}
              `}
            >
              <User2Icon size={20} />
              <span>MIS DATOS</span>
            </Link>

          </nav>

          <div className="border-t border-gray-200" />

          <button
            onClick={handleLogout}
            className="
              flex items-center gap-3 w-full px-6 py-4 text-sm font-medium
              text-gray-700 hover:text-red-500 hover:bg-gray-50 transition
            "
          >
            <LogOutIcon size={20} />
            Cerrar sesión
          </button>

          <div className="bg-red-500 h-4 w-full" />
        </div>
      </aside>
    </>
  )
}
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const pathname = usePathname()
  const topClass = pathname === '/' ? 'top-20' : 'top-15'

  const NAV_ITEMS = [
    { label: 'PIZZAS', href: '/pizzas' },
    { label: 'BURGERS', href: '/burgers' },
    { label: 'ENTRANTES', href: '/entrantes' },
    { label: 'BEBIDAS', href: '/bebidas' },
    { label: 'POSTRES', href: '/postres' },
  ]

  const SECONDARY_ITEMS = [
    { label: 'CALIDAD Y PRODUCTO', href: '/calidad' },
    { label: 'AVISO LEGAL', href: '/aviso-legal' },
  ]
  return (
    <>
      {isOpen && (
        <div 
          className='fixed inset-0 bg-black/50 z-10'
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed ${topClass} left-0 bottom-0 w-[80%] bg-[#f9f9f9] shadow-lg z-20 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >

        <nav className='flex-1 pb-4 pt-2'>
          <ul className='font-bold'>
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className='mx-2'>
                <Link 
                  href={item.href}
                  onClick={onClose}
                  className='block w-full text-left px-3 py-4 hover:bg-red-50 text-gray-800 border-b border-gray-800 transition-colors'
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className='py-4'>
          <ul className='space-y-1'>
            {SECONDARY_ITEMS.map((item) => (
              <li key={item.label}>
                <Link 
                  href={item.href}
                  onClick={onClose}
                  className='block w-full text-left px-5 py-4 hover:bg-gray-50 text-gray-600 text-sm transition-colors'
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}
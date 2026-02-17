'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartIcon, MenuIcon, UserIcon } from './Icons';
import SideMenu from './SideMenu';
import AuthModal from './AuthModal'

type Headervariant = 'home' | 'main'

export default function Header({ variant = 'home'}: {variant?: Headervariant} ) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const handleMenuToggle = () => {
    setIsAuthOpen(false)
    setIsMenuOpen(!isMenuOpen)
  }

  const handleAuthToggle = () => {
    setIsMenuOpen(false)
    setIsAuthOpen(!isAuthOpen)
  }

  const logo = (
    <Link href='/' className='cursor-pointer'>
      <Image
        src='/logo_v2.png'
        alt='Logo de la pizzeria Bella Masa'
        width={388}
        height={76}
        className='h-6 w-auto'
      />
    </Link>
  )

  const menuButton = (
    <button aria-label="Abrir menú" onClick={handleMenuToggle}>
      <MenuIcon size={25} />
    </button>
  )

  const authAndCart = (
    <div className='flex gap-3 items-center'>
      <button
        aria-label="Acceso de usuario"
        className="flex flex-col items-center gap-0"
        onClick={handleAuthToggle}
      >
        <UserIcon size={23} />
        <span className='text-[10px]'>ACCESO</span>
      </button>

      <button aria-label="Ver carrito" className="flex flex-col items-center gap-0.5">
        <CartIcon size={20} />
        <span className='text-[10px]'>CARRITO</span>
      </button>
    </div>
  )

  return (
    <>
      {variant === 'home' ? (

        <header className='sticky top-0 w-full text-white bg-red-500 flex flex-col justify-center items-center gap-2 p-2 z-40'>
          {logo}
          <nav className='flex gap-3 justify-between items-center w-full max-w-md px-2'>
            <div className='flex gap-4 items-center'>
              {menuButton}
              <button className='text-sm bg-white text-red-500 border border-white rounded-4xl px-3.5 py-1'>
                COMENZAR PEDIDO
              </button>
            </div>
            {authAndCart}
          </nav>
        </header>
      ) : (
        <header className='sticky top-0 w-full text-white bg-red-500 flex justify-center items-center gap-2 px-2 py-3 z-40'>
          <nav className='flex gap-3 justify-between items-center w-full max-w-md px-2'>
            {menuButton}
            {logo}
            {authAndCart}
          </nav>
        </header>
      )}

      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  )
}
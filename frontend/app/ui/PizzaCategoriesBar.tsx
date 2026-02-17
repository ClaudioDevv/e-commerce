'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function PizzaCategoriesBar () {
  const path = usePathname()
  const activeRef = useRef<HTMLLIElement | null>(null)

  const categories = [
    {
      id: 'todas',
      name: 'TODAS',
      slug: '/pizzas',
    },
    {
      id: 'tradizionali',
      name: 'TRADIZIONALI',
      slug: '/pizzas/tradizionali',
    },
    {
      id: 'gourmet',
      name: 'GOURMET',
      slug: '/pizzas/gourmet',
    },
    {
      id: 'especiales',
      name: 'ESPECIALES BELLA MASSA',
      slug: '/pizzas/especiales',
    }
  ]

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      })
    }
  }, [path])

  return (
    <nav className='mb-8 overflow-x-auto' aria-label='Categorías de pizzas'>
        <ul className='flex gap-4 pb-2 scroll-smooth'>
          {categories.map((category) => {
            const isActive = path === category.slug

            return (
              <li 
                key={category.id}
                ref={isActive ? activeRef : null}
              >
                <Link 
                  href={`${category.slug}`}
                  className={`block whitespace-nowrap transition-colors 
                    ${isActive
                      ? 'font-bold border-b-3 border-red-500'
                      : 'font-medium'
                    }
                  `}
                >
                  {category.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
  )
}
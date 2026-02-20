import Image from 'next/image'
import type { Product } from '@/app/lib/api/products'

const getOptimizedUrl = (url: string, width: number) =>
  url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`)

export default function ProductCard({ pizza }: { pizza: Product }) {
  return (
    <article className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-40'>
      <div className='flex h-full'>

        <div className='relative h-40 w-40 shrink-0 bg-gray-100'>
          {pizza.imageUrl ? (
            <Image
              src={getOptimizedUrl(pizza.imageUrl, 400)}
              alt={pizza.name}
              fill
              sizes='160px'
              className='object-cover'
            />
          ) : (
            <div className='flex items-center justify-center h-full text-gray-400'>
              Sin imagen
            </div>
          )}
        </div>

        <div className='flex flex-col justify-between flex-1 px-4 py-2'>
          <div>
            <h3 className='text-lg font-bold text-gray-800'>{pizza.name}</h3>
            <p className='text-gray-600 text-sm mt-1 line-clamp-2'>
              {pizza.description}
            </p>
          </div>

          <button className='bg-red-600 text-white px-4 py-2 rounded-2xl font-semibold text-sm hover:bg-red-700 transition-colors self-start'>
            AÑADIR
          </button>
        </div>
        
      </div>
    </article>
  )
}
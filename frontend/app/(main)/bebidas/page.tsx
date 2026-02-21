import { getBebidas } from '@/app/lib/api/products'
import ProductCard from '@/app/ui/ProductCard'

const CATEGORIES = [
  {
    id:'Refrescos',
    subcategory: 'REFRESCOS',
    title: 'Refrescos'
  },
  {
    id:'SinGas',
    subcategory: 'SIN GAS',
    title: 'Sin Gas'
  },
  {
    id:'Cerveza',
    subcategory: 'CERVEZA',
    title: 'Cerveza'
  }
]

export default async function BebidasPage() {
  const bebidas = await getBebidas()

  return (
    <main className='container mx-auto px-4 py-6'>
      <header className='mb-6'>
        <h1 className='text-3xl font-bold text-left text-gray-800'>BEBIDAS</h1>
      </header>

      {CATEGORIES.map((cat) => {
              const bebidasSubcat = bebidas.filter(p => p.subcategory === cat.subcategory)
      
              return (
                <section key={cat.id} id={cat.id} className='mb-12 scroll-mt-24'>
                  <header className='mb-4'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                      {cat.title}
                    </h2>
                  </header>
      
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {bebidasSubcat.length > 0 ? (
                      bebidasSubcat.map(bebida => (
                        <ProductCard key={bebida.id} product={bebida} />
                      ))
                    ) : (
                      <p className='text-gray-500 col-span-full text-center py-8'>
                        No hay bebidas disponibles en esta categoría.
                      </p>
                    )}
                  </div>
                </section>
              )
            })}
      
    </main>
  )
}
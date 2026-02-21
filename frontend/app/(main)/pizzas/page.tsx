import Image from 'next/image'
import PizzaCategoriesBar from '@/app/ui/PizzaCategoriesBar'
import ProductCard from '@/app/ui/ProductCard'
import { getPizzas } from '@/app/lib/api/products'

const CATEGORIES = [
    {
      id: 'tradizionali',
      subcategory: 'TRADIZIONALI',
      title: 'Tradizionali',
      description: 'Las auténticas recetas italianas que nunca pasan de moda. Ingredientes frescos y tradición en cada bocado.'
    },
    {
      id: 'gourmet',
      subcategory: 'GOURMET',
      title: 'Gourmet',
      description: 'Sabores únicos y combinaciones premium pensadas para paladares exigentes.'
    },
    {
      id: 'especiales',
      subcategory: 'ESPECIALES',
      title: 'Especiales Bella Massa',
      description: 'Recetas exclusivas que solo encontrarás en Bella Massa. Cada pizza, una obra de arte.'
    }
  ]

export default async function PizzasPage() {
  const pizzas = await getPizzas()

  return (
    <main className='container mx-auto px-4 py-6'>
      <header className='mb-6'>
        <h1 className='text-3xl font-bold text-left text-gray-800'>PIZZAS</h1>
      </header>

      <PizzaCategoriesBar />

      <section className='mb-10 scroll-mt-24'>
        <header className='mb-4'>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>
              Todas las Pizzas
            </h2>
            <p className='text-gray-600'>
              Explora nuestra carta completa de pizzas artesanales.
            </p>
          </header>
          <div className="relative w-full h-28">
            <Image
              src="/bannerPizza.png"
              alt="Banner pizzas"
              fill
              className="object-cover"
              priority
            />
          </div>
      </section>

      {/* CARGAR PIZZAS POR CATEGORIAS */}
      {CATEGORIES.map((cat) => {
        const pizzasDeCategoria = pizzas.filter(p => p.subcategory === cat.subcategory)

        return (
          <section key={cat.id} id={cat.id} className='mb-12 scroll-mt-24'>
            <header className='mb-4'>
              <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                {cat.title}
              </h2>
              <p className='text-gray-600'>{cat.description}</p>
            </header>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {pizzasDeCategoria.length > 0 ? (
                pizzasDeCategoria.map(pizza => (
                  <ProductCard key={pizza.id} product={pizza} />
                ))
              ) : (
                <p className='text-gray-500 col-span-full text-center py-8'>
                  No hay pizzas disponibles en esta categoría.
                </p>
              )}
            </div>
          </section>
        )
      })}
    </main>
  )
}
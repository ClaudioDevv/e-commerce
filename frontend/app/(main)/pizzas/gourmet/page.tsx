import PizzaCategoriesBar from '@/app/ui/PizzaCategoriesBar';
import ProductCard from '@/app/ui/ProductCard';
import { getPizzasBySubcategory } from '@/app/lib/api/products';

export default async function PizzasGourmetPage() {
  const pizzas = await getPizzasBySubcategory('gourmet')

  return (
    <main className='container mx-auto px-4 py-6'>
      <PizzaCategoriesBar />

      <section className='mb-12 scroll-mt-24'>
        <header className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>
              Gourmet
            </h2>
            <p className='text-gray-600'>
              Sabores únicos y combinaciones premium pensadas para paladares exigentes.
            </p>
        </header>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {pizzas.length > 0 ? (
            pizzas.map(pizza => (
              <ProductCard key={pizza.id} pizza={pizza} />
            ))
          ) : (
            <p className='text-gray-500 col-span-full text-center py-8'>
              No hay pizzas disponibles en esta categoría.
            </p>
          )}
        </div>
          

      </section>
    </main>
  )
}
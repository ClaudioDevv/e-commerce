import PizzaCategoriesBar from '@/app/ui/PizzaCategoriesBar';

export default async function PizzasEspecialesPage() {
  return (
    <main className='container mx-auto px-4 py-6'>
      <PizzaCategoriesBar />

      <section 
        className='mb-12 scroll-mt-24'
        aria-labelledby='Pizzas-Gourmet-Heading'
      >
        <header className='mb-4'>
            <h2 
              className='text-2xl font-bold text-gray-800 mb-2'
            >
              Tradizionali
            </h2>
            <p className='text-gray-600'>
              Las auténticas recetas italianas que nunca pasan de moda. Ingredientes frescos y tradición en cada bocado.
            </p>
          </header>
          
        
      </section>
    </main>
  )
}
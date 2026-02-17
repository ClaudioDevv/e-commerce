import PizzaCategoriesBar from '@/app/ui/PizzaCategoriesBar';

export default async function PizzasEspecialesPage() {
  return (
    <main className='container mx-auto px-4 py-6'>
      <PizzaCategoriesBar />

      <section 
        className='mb-12 scroll-mt-24'
        aria-labelledby='Pizzas-Especiales-Heading'
      >
        <header className='mb-4'>
            <h2 
              className='text-2xl font-bold text-gray-800 mb-2'
            >
              Especiales Bella Massa
            </h2>
            <p className='text-gray-600'>
              Recetas exclusivas que solo encontrarás en Bella Massa. Cada pizza, una obra de arte.
            </p>
          </header>
          
        
      </section>
    </main>
  )
}
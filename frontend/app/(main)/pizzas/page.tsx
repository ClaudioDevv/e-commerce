import Image from 'next/image'
import PizzaCategoriesBar from '../../ui/PizzaCategoriesBar'

export default async function PizzasPage() {
  // const pizzas = await fetch('/api/products')
  // const res = pizzas.json()

  const categories = [
    {
      id: 'tradizionali',
      name: 'TRADIZIONALI',
      slug: '/pizzas/tradizionali',
      title: 'Tradizionali',
      description: 'Las auténticas recetas italianas que nunca pasan de moda. Ingredientes frescos y tradición en cada bocado.',
      pizzas: []
    },
    {
      id: 'gourmet',
      name: 'GOURMET',
      slug: 'pizzas/gourmet',
      title: 'Gourmet',
      description: 'Sabores únicos y combinaciones premium pensadas para paladares exigentes.',
      pizzas: []
    },
    {
      id: 'especiales',
      name: 'ESPECIALES BELLA MASSA',
      slug: '/pizzas/especiales',
      title: 'Especiales Bella Massa',
      description: 'Recetas exclusivas que solo encontrarás en Bella Massa. Cada pizza, una obra de arte.',
      pizzas: []
    }
  ]

  return (
    <main className='container mx-auto px-4 py-6'>
      <header className='mb-6'>
        <h1 className='text-3xl font-bold text-left text-gray-800'>PIZZAS</h1>
      </header>

      <PizzaCategoriesBar />

      <section 
        className='mb-12 scroll-mt-24'
        aria-labelledby='Todas-las-pizzas-heading'
      >
        <header className='mb-4'>
            <h2 
              className='text-2xl font-bold text-gray-800 mb-2'
            >
              Todas las Pizzas
            </h2>
            <p className='text-gray-600'>
              Explora nuestra carta completa de pizzas artesanales.
            </p>
          </header>
          <div className="relative w-full h-28">
            <Image
              src="/bannerPizza.png"
              alt="Prueba la pizza italiana banner"
              fill
              className="object-cover"
              priority
            />
          </div>
        
      </section>

      {/* CARGAR PIZZAS POR CATEGORIAS */}
      {categories.map((category) => (
        <section 
          key={category.id}
          id={category.id}
          className='mb-12 scroll-mt-24'
          aria-labelledby={`${category.id}-heading`}
        >
          <header className='mb-4'>
            <h2 
              id={`${category.id}-heading`}
              className='text-2xl font-bold text-gray-800 mb-2'
            >
              {category.title}
            </h2>
            <p className='text-gray-600'>{category.description}</p>
          </header>

          {/* Grid de pizzas */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
  
            {category.pizzas.length > 0 ? (
              category.pizzas.map((pizza: any) => (
                <article key={pizza.id} className='bg-white rounded-lg shadow-md p-4'>

                  <h3>{pizza.name}</h3>
                  <p>{pizza.description}</p>
                  <p className='font-bold'>{pizza.price}€</p>
                </article>
              ))
            ) : (
              <p className='text-gray-500 col-span-full text-center py-8'>
                Cargando pizzas...
              </p>
            )}
          </div>
        </section>
      ))}
    </main>
  )
}
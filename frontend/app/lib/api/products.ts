export type ProductVariant = {
  id: string
  name: string
  priceDelta: number
}

export type Product = {
  id: string
  name: string
  description: string | null
  basePrice: number
  imageUrl: string | null
  subcategory: string | null
  allowCustomization: boolean
  variants: ProductVariant[]
}

export const getPizzas = async (): Promise<Product[]> => {
  const res = await fetch('http://localhost:3001/api/products/category/pizza', {
    next: { revalidate: 3600 } // cache 1 hora, revalida automáticamente
  })

  if (!res.ok) throw new Error('Error al cargar las pizzas')

  const jsonRes = await res.json()
  
  return jsonRes.data || []
}

export const getPizzasBySubcategory = async (subcategory: string): Promise<Product[]> => {
  const res = await fetch(`http://localhost:3001/api/products/category/pizza/${subcategory}`, {
    next: { revalidate: 3600 } // cache 1 hora, revalida automáticamente
  })

  if (!res.ok) throw new Error('Error al cargar las pizzas')

  const jsonRes = await res.json()
  
  return jsonRes.data || []
}
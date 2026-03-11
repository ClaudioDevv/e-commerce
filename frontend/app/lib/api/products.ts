const API_URL = process.env.API_URL || 'http://localhost:3001'

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

const CACHE_1H: RequestInit = { next: { revalidate: 3600 } }

export const productsApi = {
  async getPizzas (): Promise<Product[]> {
    const res = await fetch(`${API_URL}/api/products/category/pizza`, CACHE_1H)
  
    if (!res.ok) throw new Error('Error al cargar las pizzas')
  
    const { data }= await res.json()
    
    return data ?? []
  },
  
  async getPizzasBySubcategory(subcategory: string): Promise<Product[]> {
    const res = await fetch(`${API_URL}/api/products/category/pizza/${subcategory}`, CACHE_1H)
    if (!res.ok) throw new Error(`Error al cargar pizzas: ${subcategory}`)
    const { data } = await res.json()
    return data ?? []
  },

  async getBebidas(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/api/products/category/bebida`, CACHE_1H)
    if (!res.ok) throw new Error('Error al cargar las bebidas')
    const { data } = await res.json()
    return data ?? []
  },
}

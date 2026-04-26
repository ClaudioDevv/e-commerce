import OrderManager from '@/app/ui/OrderManager'

export default function OrdersPage() {
  return (
    <main className='max-w-2xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold text-gray-900 mb-8'>Historial de Pedidos</h1>
      <OrderManager />
    </main>
  )
}
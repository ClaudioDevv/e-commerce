import ProfileForm from '@/app/ui/ProfileForm';
import AddressManager from '@/app/ui/AddressManager'


export default function ProfilePage() {
  
  return (
    <main className='max-w-2xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold text-gray-900 mb-8'>Mis Datos</h1>
      <ProfileForm />

      <hr className="my-10 border-gray-300" />
      
      {/*Address gestion */}
      <h1 className='text-2xl font-bold text-gray-900 mb-8'>Direcciones guardadas</h1>
      <AddressManager />
      
    </main>
  )
}
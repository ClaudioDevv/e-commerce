import Image from "next/image";
import CarouselOfertas from '@/app/ui/CarouselOfertas';
import Header from '@/app/ui/Header';

export default function Home() {
  return (
    <>
      <Header variant="home"/>
        <section className='flex flex-col items-center py-7 pt-0 gap-6'>
          <CarouselOfertas />
          <h1 className='text-3xl font-bold text-foreground text-center p-2'>
            DESCUBRE NUESTRAS OFERTAS
          </h1>
          <div className='flex flex-col items-center gap-6 md:grid md:grid-cols-2'>
            <Image
              src='/gelato_v2.png'
              alt='Gelato italiano original'
              width={250}
              height={250}
              className='border rounded-2xl'
            />
            <Image
              src='/refrescos.png'
              alt='Oferta en refrescos'
              width={250}
              height={250}
              className='border rounded-2xl'
            />
          </div>
        </section>
    </>
  )
}

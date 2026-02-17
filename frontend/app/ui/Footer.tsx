import Link from 'next/link';
import { FacebookIcon, InstagramIcon, XIcon, YTIcon } from './Icons';
import Image from 'next/image';

export default function Footer() {
 return (
  <footer className='text-white bg-red-500 py-8 px-4'>
          <div className='flex justify-center mb-6'>
            <Image 
              src='/logo_v2.png'
              alt='Logo de la pizzeria Bella Masa'
              width={476}
              height={105}
              className='h-10 w-auto'
            />
          </div>

          <nav aria-label='Redes sociales' className='flex flex-col items-center justify-center mb-6 gap-3'>
            <span className='text-sm font-medium'>
              Síguenos en:
            </span>

            <ul className='flex items-center gap-4'>
              <li>
                <Link href={'#'} aria-label='Instagram de Bella Masa'>
                  <InstagramIcon size={20} />
                </Link>
              </li>
              <li>
                <Link href={'#'} aria-label='Facebook de Bella Masa'>
                  <FacebookIcon size={20} />
                </Link>
              </li>
              <li>
                <Link href={'#'} aria-label='X (Twitter) de Bella Masa'>
                  <XIcon size={20} />
                </Link>
              </li>
              <li>
                <Link href={'#'} aria-label='YouTube de Bella Masa'>
                  <YTIcon size={20} />
                </Link>
              </li>
            </ul>
          </nav>
          
          <nav aria-label='Enlaces del sitio' className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 mb-8'>

            <div className='flex flex-col gap-2'>
              <h3 className='font-semibold mb-1'>Bella Massa</h3>
              <Link href={'#'} className='text-sm hover:underline'>Acerca de nosotros</Link>
              <Link href={'#'} className='text-sm hover:underline'>Trabaja con nosotros</Link>
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='font-semibold mb-1'>Calidad y producto</h3>
              <Link href={'#'} className='text-sm hover:underline'>Ingredientes</Link>
              <Link href={'#'} className='text-sm hover:underline'>Listado de alérgenos</Link>
              <Link href={'#'} className='text-sm hover:underline'>Valores nutricionales</Link>
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='font-semibold mb-1'>Carta</h3>
              <Link href={'#'} className='text-sm hover:underline'>Pizzas</Link>
              <Link href={'#'} className='text-sm hover:underline'>Entrantes</Link>
              <Link href={'#'} className='text-sm hover:underline'>Bebidas</Link>
              <Link href={'#'} className='text-sm hover:underline'>Postres</Link>
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='font-semibold mb-1'>Legal</h3>
              <Link href={'#'} className='text-sm hover:underline'>Aviso legal</Link>
              <Link href={'#'} className='text-sm hover:underline'>Condiciones generales de venta</Link>
              <Link href={'#'} className='text-sm hover:underline'>Política de privacidad</Link>
              <Link href={'#'} className='text-sm hover:underline'>Canal del informante</Link>
              <Link href={'#'} className='text-sm hover:underline'>Política de cookies</Link>
            </div>
          </nav>

          <div className='text-center text-sm border-t border-red-800 pt-4'>
            <p>© {new Date().getFullYear()} Bella Massa. Todos los derechos reservados.</p>
          </div>

        </footer>
 )
}
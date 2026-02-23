import { prisma } from '../../src/lib/prisma'
import { Category } from '../../src/generated/prisma'

async function main () {
  const product = await prisma.product.create({
    data: {
      name: 'Triángulos de Queso',
      description: 'Si te gusta el queso chedar este es tu entrante',
      category: Category.ENTRANTE,
      basePrice: 7.00,
      active: true,
      allowCustomization: false,
    }
  })

  console.log('Producto creado:', product)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

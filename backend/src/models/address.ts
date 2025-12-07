import { prisma } from '../lib/prisma'
import { AppError } from '../utils/AppError'

export const getAll = async (userId: string) => {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' }
    ]
  })
}

export const getAddressById = async (id: string, userId: string) => {
  const address = await prisma.address.findFirst({
    where: {
      id,
      userId
    }
  })

  if (!address) {
    throw new AppError('Dirección no encontrada', 404)
  }

  return address
}

export const deleteAddress = async (id: string, userId: string) => {
  await getAddressById(id, userId)

  return await prisma.address.delete({
    where: { id }
  })
}

export const createAddress = async (addressData: {
  userId: string,
  label?: string,
  street: string,
  city: string,
  postalCode: string,
  province?: string,
  instructions?: string,
  isDefault?: boolean
}) => {
  const existingAddresses = await prisma.address.count({
    where: { userId: addressData.userId }
  })

  const isDefault = existingAddresses === 0 ? true : (addressData.isDefault || false)

  if (isDefault) {
    await prisma.address.updateMany({
      where: {
        userId: addressData.userId,
        isDefault: true
      },
      data: { isDefault: false }
    })
  }

  return await prisma.address.create({
    data: {
      ...addressData,
      isDefault
    }
  })
}

export const updateAddress = async (
  id: string,
  userId: string,
  data: {
    label?: string,
    street?: string,
    city?: string,
    postalCode?: string,
    province?: string,
    instructions?: string
  }
) => {
  await getAddressById(id, userId)

  return await prisma.address.update({
    where: { id },
    data

  })
}

export const defaultAddress = async (id: string, userId: string) => {
  await getAddressById(id, userId)

  // Transacción
  return await prisma.$transaction(async (tx) => {
    // Quitar isDefault de todas las direcciones del usuario
    await tx.address.updateMany({
      where: {
        userId,
        isDefault: true
      },
      data: { isDefault: false }
    })

    // Marcar esta como predeterminada
    return await tx.address.update({
      where: { id },
      data: { isDefault: true }
    })
  })
}

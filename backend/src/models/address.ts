import { prisma } from '../lib/prisma'
import { AddressInput, UpdateAddressInput } from '../validators/addressValidator'

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

  return address
}

export const deleteAddress = async (id: string, userId: string) => {
  await getAddressById(id, userId)

  return await prisma.address.delete({
    where: { id }
  })
}

export const createAddress = async (userId:string, addressData: AddressInput['body']) => {
  const existingAddresses = await prisma.address.count({
    where: { userId }
  })

  const isDefault = existingAddresses === 0 ? true : (addressData.isDefault || false)

  if (isDefault) {
    await prisma.address.updateMany({
      where: {
        userId,
        isDefault: true
      },
      data: { isDefault: false }
    })
  }

  return await prisma.address.create({
    data: {
      userId,
      ...addressData,
      isDefault
    }
  })
}

export const updateAddress = async (
  id: string,
  userId: string,
  data: UpdateAddressInput['body']
) => {
  await getAddressById(id, userId)

  return await prisma.address.update({
    where: { id },
    data
  })
}

export const defaultAddress = async (id: string, userId: string) => {
  await getAddressById(id, userId)

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

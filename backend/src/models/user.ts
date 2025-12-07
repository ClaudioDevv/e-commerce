import { prisma } from '../lib/prisma'
import { RegisterInput } from '../validators/authValidator'

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email, active: true }
  })
}

export const findUserByPhone = async (phone: string) => {
  return await prisma.user.findUnique({
    where: { phone }
  })
}

export const createUser = async (userData: RegisterInput['body']) => {
  return await prisma.user.create({
    data: {
      ...userData,
      role: 'CUSTOMER'
    }
  })
}

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id }
  })
}

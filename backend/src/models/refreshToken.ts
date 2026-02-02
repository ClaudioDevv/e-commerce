import { prisma } from '../lib/prisma'

export const save = async (userId: string, token: string, expiresAt: Date, deviceInfo?: string) => {
  return await prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresAt,
      deviceInfo: deviceInfo || 'Unknown device'
    }
  })
}

export const findByToken = async (token: string) => {
  return await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true }
  })
}

export const deleteByToken = async (token: string) => {
  await prisma.refreshToken.deleteMany({
    where: { token }
  })
}

export const deleteAllByUser = async (userId: string) => {
  await prisma.refreshToken.deleteMany({
    where: { userId }
  })
}

export const isTokenAlreadyUsed = async (token: string): Promise<boolean> => {
  const exists = await prisma.refreshToken.findUnique({
    where: { token }
  })
  return exists === null
}

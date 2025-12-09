import { prisma } from '../lib/prisma'

export const updatePaymentSession = async (orderId: string, sessionId: string) => {
  await prisma.payment.update({
    where: { orderId },
    data: {
      providerPaymentId: sessionId
    }
  })
}

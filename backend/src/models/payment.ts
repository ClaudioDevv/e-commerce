import { prisma } from '../lib/prisma'

export const updateSession = async (orderId: string, sessionId: string) => {
  await prisma.payment.update({
    where: { orderId },
    data: {
      sessionId,
    },
  })
}

export const markAsRefundedByOrderId = async (orderId: string, providerRefundId: string) => {
  await prisma.payment.update({
    where: { orderId },
    data: {
      status: 'REFUNDED',
      providerRefundId,
    },
  })
}

export const markAsRefundedById = async (id: string, providerRefundId: string) => {
  await prisma.payment.update({
    where: { id },
    data: {
      status: 'REFUNDED',
      providerRefundId
    }
  })
}

export const confirmSuccess = async (orderId: string, paymentIntentId: string) => {
  return await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' }
    }),
    prisma.payment.update({
      where: { orderId },
      data: {
        status: 'SUCCEEDED',
        providerPaymentId: paymentIntentId
      }
    })
  ])
}

export const findByProviderId = async (providerPaymentId: string) => {
  return await prisma.payment.findFirst({
    where: { providerPaymentId }
  })
}

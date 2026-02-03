import { stripe } from '../../../src/config/stripe'
import { webhook } from '../../../src/controllers/paymentController'
import * as OrderModel from '../../../src/models/order'
import * as PaymentModel from '../../../src/models/payment'

process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret'

jest.mock('../../../src/models/order', () => ({
  findOrderById: jest.fn(),
  expireOrder: jest.fn()
}))

jest.mock('../../../src/models/payment', () => ({
  confirmSuccess: jest.fn(),
  findByProviderId: jest.fn(),
  markAsRefundedById: jest.fn()
}))

jest.mock('../../../src/config/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn()
    }
  }
}))

describe('Payment Webhook Controller', () => {
  let mockReq: any
  let mockRes: any

  beforeEach(() => {
    jest.clearAllMocks()

    mockReq = {
      body: 'raw-body',
      headers: { 'stripe-signature': 'whsec_test' }
    }

    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    }
  })

  describe('Validacion', () => {
    test('rechazar si falta stripe-signature header', async () => {
      mockReq.headers = {}

      await webhook(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Falta firma de Stripe'
      })
    })

    test('rechazar si firma es inválida', async () => {
      const constructEventMock = stripe.webhooks.constructEvent as jest.Mock
      constructEventMock.mockImplementation(() => {
        throw new Error('Invalid Signature')
      })

      await webhook(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.send).toHaveBeenCalledWith(
        expect.stringContaining('Webhook Error')
      )
    })
  })

  describe('checkout.session.completed', () => {
    test('marcar pedido como PAID exitosamente', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: { orderId: 'order_123' },
            payment_intent: 'pi_123'
          }
        }
      }

      const constructEventMock = stripe.webhooks.constructEvent as jest.Mock
      constructEventMock.mockReturnValue(mockEvent)

      const order = {
        id: 'order_123',
        status: 'PENDING'
      }
      const findOrderByIdMock = OrderModel.findOrderById as jest.Mock
      findOrderByIdMock.mockResolvedValue(order)

      const confirmSuccessMock = PaymentModel.confirmSuccess as jest.Mock
      confirmSuccessMock.mockResolvedValue({})

      await webhook(mockReq, mockRes)

      expect(confirmSuccessMock).toHaveBeenCalledWith('order_123', 'pi_123')

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({ received: true })
    })

    test('idempotencia: ignorar si pedido ya está PAID', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: { orderId: 'order_123' },
            payment_intent: 'pi_123'
          }
        }
      }
      const constructEventMock = stripe.webhooks.constructEvent as jest.Mock
      constructEventMock.mockReturnValue(mockEvent)

      const order = {
        id: 'order_123',
        status: 'PAID'
      }
      const findOrderByIdMock = OrderModel.findOrderById as jest.Mock
      findOrderByIdMock.mockResolvedValue(order)

      const confirmSuccessMock = PaymentModel.confirmSuccess as jest.Mock

      await webhook(mockReq, mockRes)

      expect(confirmSuccessMock).not.toHaveBeenCalled()

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({ received: true })
    })

    test('rechazar si falta orderId en metadata', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: {},
            payment_intent: 'pi_123'
          }
        }
      }
      const constructEventMock = stripe.webhooks.constructEvent as jest.Mock
      constructEventMock.mockReturnValue(mockEvent)

      await webhook(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing orderId' })

      const confirmSuccessMock = PaymentModel.confirmSuccess as jest.Mock
      expect(confirmSuccessMock).not.toHaveBeenCalled()
    })

    test('rechazar si pedido no existe', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: { orderId: 'order_123' },
            payment_intent: 'pi_123'
          }
        }
      }
      const constructEventMock = stripe.webhooks.constructEvent as jest.Mock
      constructEventMock.mockReturnValue(mockEvent)

      const findOrderByIdMock = OrderModel.findOrderById as jest.Mock
      findOrderByIdMock.mockResolvedValue(null)

      await webhook(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Order not found' })
    })
  })

  describe('charge.refunded', () => {
    test('marcar payment como REFUNDED', async () => {
      const mockEvent = {
        type: 'charge.refunded',
        data: {
          object: {
            payment_intent: 'pi_123',
            refunds: {
              data: [
                { id: 're_123' }
              ]
            }
          }
        }
      }
      const constructEventMock = stripe.webhooks.constructEvent as jest.Mock
      constructEventMock.mockReturnValue(mockEvent)

      const payment = {
        id: 'p_1',
        status: 'PAID'
      }
      const findByProviderIdMock = PaymentModel.findByProviderId as jest.Mock
      findByProviderIdMock.mockResolvedValue(payment)

      await webhook(mockReq, mockRes)

      const markAsRefundedByIdMock = PaymentModel.markAsRefundedById as jest.Mock
      expect(markAsRefundedByIdMock).toHaveBeenCalledWith('p_1', 're_123')
    })

    test('no duplicar refund si ya está REFUNDED', async () => {
      const mockEvent = {
        type: 'charge.refunded',
        data: {
          object: {
            payment_intent: 'pi_123',
            refunds: {
              data: [
                { id: 're_123' }
              ]
            }
          }
        }
      }
      const constructEventMock = stripe.webhooks.constructEvent as jest.Mock
      constructEventMock.mockReturnValue(mockEvent)

      const payment = {
        status: 'REFUNDED'
      }
      const findByProviderIdMock = PaymentModel.findByProviderId as jest.Mock
      findByProviderIdMock.mockResolvedValue(payment)

      await webhook(mockReq, mockRes)

      const markAsRefundedByIdMock = PaymentModel.markAsRefundedById as jest.Mock
      expect(markAsRefundedByIdMock).not.toHaveBeenCalled()
    })
  })

  test('siempre retornar 200 aunque falle internamente', async () => {
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: { orderId: 'order_123' },
          payment_intent: 'pi_123'
        }
      }
    }
    const constructEventMock = stripe.webhooks.constructEvent as jest.Mock
    constructEventMock.mockReturnValue(mockEvent)

    const findOrderByIdMock = OrderModel.findOrderById as jest.Mock
    findOrderByIdMock.mockRejectedValue(new Error('Database error'))

    await webhook(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({ received: true })
  })
})

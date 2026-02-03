import Decimal from 'decimal.js'
import { createStripeCheckoutSession, OrderForStripeCheckout } from '../../../src/services/stripeService'
import { stripe } from '../../../src/config/stripe'
process.env.FRONTEND_URL = 'http://localhost:3000'

jest.mock('../../../src/config/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
      }
    }
  }
}))

describe('createStripeCheckoutSession', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('Validaciones', () => {
    test('Rechazar pedido que no está Pending', async () => {
      const order = {
        status: 'PAID'
      } as OrderForStripeCheckout

      await expect(createStripeCheckoutSession(order)).rejects.toThrow('Este pedido no se puede pagar')
    })

    test('Rechazar pedido no configurado con Stripe provider', async () => {
      const order = {
        status: 'PENDING',
        payment: {
          provider: 'CASH'
        }
      } as OrderForStripeCheckout

      await expect(createStripeCheckoutSession(order)).rejects.toThrow('Este pedido no está configurado para pago con Stripe')
    })
  })

  describe('Line items', () => {
    test('Crear line items correcto para producto', async () => {
      const createMock = stripe.checkout.sessions.create as jest.Mock
      createMock.mockResolvedValue({ id: 'session_123', url: 'https://...' })

      const order = {
        id: 'order_123',
        userId: 'user_456',
        status: 'PENDING',
        payment: {
          provider: 'STRIPE'
        },
        items: [
          { nameSnapshot: 'Pizza Vegetal', unitPrice: new Decimal(10), quantity: 2 }
        ],
        deliveryFee: new Decimal(0)
      } as OrderForStripeCheckout

      await createStripeCheckoutSession(order)
      expect(createMock).toHaveBeenCalledWith({
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Pizza Vegetal'
            },
            unit_amount: 1000,
          },
          quantity: 2
        }],
        mode: 'payment',
        success_url: expect.stringContaining('order-success'),
        cancel_url: expect.stringContaining('order-cancelled'),
        metadata: expect.objectContaining({
          orderId: order.id
        })
      })
    })

    test('Convertir precio a centimos correctamente', async () => {
      const createMock = stripe.checkout.sessions.create as jest.Mock
      createMock.mockResolvedValue({ id: 'session_123', url: 'https://...' })

      const order = {
        id: 'order_123',
        userId: 'user_456',
        status: 'PENDING',
        payment: {
          provider: 'STRIPE'
        },
        items: [
          { nameSnapshot: 'Pizza Vegetal', unitPrice: new Decimal(10.999), quantity: 2 }
        ],
        deliveryFee: new Decimal(0)
      } as OrderForStripeCheckout

      await createStripeCheckoutSession(order)
      expect(createMock).toHaveBeenCalledWith({
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Pizza Vegetal'
            },
            unit_amount: 1100,
          },
          quantity: 2
        }],
        mode: 'payment',
        success_url: expect.stringContaining('order-success'),
        cancel_url: expect.stringContaining('order-cancelled'),
        metadata: expect.objectContaining({
          orderId: order.id
        })
      })
    })
  })

  describe('Sesion de Stripe', () => {
    test('Caso exitoso', async () => {
      const createMock = stripe.checkout.sessions.create as jest.Mock
      createMock.mockResolvedValue({ id: 'session_123', url: 'https://pago-web-stripe' })

      const order = {
        id: 'order_123',
        userId: null,
        status: 'PENDING',
        payment: {
          provider: 'STRIPE'
        },
        items: [
          { nameSnapshot: 'Pizza Vegetal', unitPrice: new Decimal(10), quantity: 2 }
        ],
        deliveryFee: new Decimal(3)
      } as OrderForStripeCheckout

      const result = await createStripeCheckoutSession(order)
      expect(createMock).toHaveBeenCalledWith({
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Pizza Vegetal'
              },
              unit_amount: 1000,
            },
            quantity: 2
          },
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Gastos de envío',
              },
              unit_amount: 300
            },
            quantity: 1,
          }
        ],
        mode: 'payment',
        success_url: expect.stringContaining('order-success'),
        cancel_url: expect.stringContaining('order-cancelled'),
        metadata: expect.objectContaining({
          orderId: order.id
        })
      })

      expect(result).toEqual({ id: 'session_123', url: 'https://pago-web-stripe' })
    })
  })
})

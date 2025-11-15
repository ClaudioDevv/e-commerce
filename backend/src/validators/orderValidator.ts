import { z } from 'zod'
import { addressBodySchema } from './addressValidator'
import { cartItemBodySchema } from './cartValidator'

const deliveryAddressSchema = addressBodySchema.pick({
  street: true,
  city: true,
  postalCode: true,
  instructions: true
})

// Usuarios sin login
export const orderGuestSchema = z.object({
  body: z.object({
    customerName: z.string().min(2).max(50, 'El nombre puede tener máximo 50 carácteres'),
    customerPhone: z.string().regex(/^\d{9}$/, 'El teléfono debe tener exactamente 9 dígitos'),
    deliveryType: z.enum(['DELIVERY', 'PICKUP']),
    deliveryAddress: deliveryAddressSchema.optional(),
    items: z.array(cartItemBodySchema).min(1, 'Debe haber al menos un producto'),
    scheduledFor: z.iso.datetime().optional(),
    paymentProvider: z.enum(['STRIPE', 'CASH_ON_DELIVERY', 'CARD_ON_DELIVERY'])
  })
    .refine((data) => {
      if (data.deliveryType === 'DELIVERY') {
        return !!data.deliveryAddress
      }
      return true
    },
    {
      message: 'deliveryAddress es requerido para pedir a domicilio',
      path: ['deliveryAddress']
    }
    )
})

// Usuario autenticado
export const orderUserSchema = z.object({
  body: z.object({
    deliveryType: z.enum(['DELIVERY', 'PICKUP']),
    addressId: z.uuid().optional(),
    scheduledFor: z.iso.datetime().optional(),
    paymentProvider: z.enum(['STRIPE', 'CASH_ON_DELIVERY', 'CARD_ON_DELIVERY'])
  })
    .refine((data) => {
      if (data.deliveryType === 'DELIVERY') {
        return !!data.addressId
      }
      return true
    },
    {
      message: 'addressId es requerido para pedir a domicilio',
      path: ['addressId']
    }
    )
})

export type OrderGuestInput = z.infer<typeof orderGuestSchema>
export type OrderUserInput = z.infer<typeof orderUserSchema>

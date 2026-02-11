import { z } from 'zod'

export const cartItemBodySchema = z.object({
  productId: z.uuid('ID del producto inválido'),
  variantId: z.uuid('ID de la variante inválido').optional(),
  quantity: z.int().min(1, 'La cantidad mínima es 1').max(10, 'La cantidad máxima es 10'),
  notes: z.string().max(100, 'La nota no puede tener más de 100 carácteres').optional(),
  customizations: z.array(
    z.object({
      customizableId: z.int().positive(),
      action: z.enum(['ADD', 'REMOVE'])
    })
  ).optional()
})

export const cartItemSchema = z.object({
  body: cartItemBodySchema
})

export const updateCartItemSchema = z.object({
  body: z.object({
    notes: z.string().max(100, 'La nota no puede tener más de 100 carácteres').optional(),
    quantity: z.int().min(1, 'La cantidad mínima es 1').max(10, 'La cantidad máxima es 10').optional(),
    customizations: z.array(
      z.object({
        customizableId: z.int().positive(),
        action: z.enum(['ADD', 'REMOVE'])
      })
    ).optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'Debe proporcionar al menos un campo para actualizar'
  })
})

export type CartItemInput = z.infer<typeof cartItemSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>

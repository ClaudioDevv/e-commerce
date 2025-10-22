import { z } from 'zod'

export const addressSchema = z.object({
  body: z.object({
    label: z.string()
      .max(20, 'La etiqueta debe tener máximo 20 carácteres')
      .optional(),
    street: z.string()
      .min(5, 'La calle debe tener mínimo 5 caracteres')
      .max(100, 'La calle debe tener máximo 100 caracteres'),
    city: z.string()
      .min(2, 'La ciudad debe tener mínimo 2 caracteres')
      .max(50, 'La ciudad debe tener máximo 50 caracteres'),
    postalCode: z.string()
      .regex(/^\d{5}$/, 'El Código postal debe tener exactamente 5 dígitos'),
    province: z.string()
      .max(50, 'La provincia debe tener máximo 50 carácteres')
      .optional(),
    instructions: z.string()
      .max(200, 'Las instrucciones deben tener máximo 200 carácteres')
      .optional(),
    isDefault: z.boolean().optional()
  })
})

export const updateAddressSchema = z.object({
  body: z.object({
    label: z.string().max(20).optional(),
    street: z.string().min(5).max(100).optional(),
    city: z.string().min(2).max(50).optional(),
    postalCode: z.string().regex(/^\d{5}$/).optional(),
    province: z.string().max(50).optional(),
    instructions: z.string().max(200).optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'Debe proporcionar al menos un campo para actualizar'
  })
})

export type AddressInput = z.infer<typeof addressSchema>
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>

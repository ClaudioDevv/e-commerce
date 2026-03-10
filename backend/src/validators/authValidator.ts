import { z } from 'zod'

export const registerSchema = z.object({
  body: z.object({
    email: z.email('Email inválido'),
    password: z.string().min(8, 'La contraseña tiene que tener como mínimo 8 carácteres'),
    name: z.string().min(2, 'El nombre tiene que tener mínimo 2 carácteres'),
    surname: z.string().min(2, 'El apellido tiene que tener mínimo 2 carácteres'),
    phone: z.string().regex(/^\d{9}$/, 'El teléfono debe tener exactamente 9 dígitos')
  })
})

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(1, 'La contraseña es requerida')
  })
})

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'El nombre tiene que tener mínimo 2 carácteres').optional(),
    surname: z.string().min(2, 'El apellido tiene que tener mínimo 2 carácteres').optional(),
    phone: z.string().regex(/^\d{9}$/, 'El teléfono debe tener exactamente 9 dígitos').optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'Debe proporcionar al menos un campo para actualizar'
  })
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

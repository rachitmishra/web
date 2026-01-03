import { z } from 'zod'

export const LoginFormSchema = z.object({
    phoneNumber: z
        .string()
        .min(10, { message: 'Phone number invalid' })
        .max(11, { message: 'Phone number invalid' })
        .regex(/[0-9]/, { message: 'Phone number invalid' })
        .trim(),
})

export type FormState =
    | {
          errors?: {
              phoneNumber?: string[]
          }
          message?: string
      }
    | undefined

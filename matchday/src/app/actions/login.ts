'use server'

import { logIn } from '@/src/firebase/auth'
import { LoginFormSchema, FormState } from '@/src/app/lib/definitions'

export async function login(state: FormState, formData: FormData) {
    const phoneNumber = formData.get('phoneNumber')
    const validatedFields = LoginFormSchema.safeParse({
        phoneNumber: phoneNumber,
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    await logIn(phoneNumber)
}

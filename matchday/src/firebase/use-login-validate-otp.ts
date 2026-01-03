'use client'
import { useCallback, useState } from 'react'
import {
    Auth,
    AuthError,
    ConfirmationResult,
    UserCredential,
} from 'firebase/auth'

type ReturnType = {
    validateOtp: (
        confirmationResult: ConfirmationResult,
        code: string
    ) => Promise<UserCredential | undefined>
    userCredential: UserCredential | undefined
    validateOtpLoading: boolean
    validateOtpError: AuthError | undefined
}
export const useLoginValidateOtp = (): ReturnType => {
    const [error, setError] = useState<AuthError>()
    const [userCredential, setUserCredential] = useState<UserCredential>()
    const [loading, setLoading] = useState<boolean>(false)

    const validateOtp = useCallback(
        async (confirmationResult: ConfirmationResult, code: string) => {
            setLoading(true)
            setError(undefined)
            try {
                const credential = await confirmationResult.confirm(code)
                setUserCredential(credential)
                return credential
            } catch (err) {
                setError(err as AuthError)
            } finally {
                setLoading(false)
            }
        },
        []
    )

    return {
        validateOtp,
        userCredential,
        validateOtpLoading: loading,
        validateOtpError: error,
    }
}

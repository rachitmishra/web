'use client'
import { useCallback, useState } from 'react'
import {
    Auth,
    AuthError,
    signInWithPhoneNumber as firebaseSignInWithPhoneNumber,
    RecaptchaVerifier,
    ConfirmationResult,
} from 'firebase/auth'

type ReturnType = {
    sendOtp: (phoneNumber: string) => Promise<ConfirmationResult | undefined>
    confirmationResult: ConfirmationResult | undefined
    sendOtpLoading: boolean
    sendOtpError: AuthError | undefined
}
export const useLoginSendOtp = (auth: Auth): ReturnType => {
    const [error, setError] = useState<AuthError>()
    const [confirmationResult, setConfirmationResult] =
        useState<ConfirmationResult>()
    const [loading, setLoading] = useState<boolean>(false)

    const sendOtp = useCallback(
        async (phoneNumber: string) => {
            setLoading(true)
            setError(undefined)
            try {
                const result = await firebaseSignInWithPhoneNumber(
                    auth,
                    `+91${phoneNumber}`,
                    new RecaptchaVerifier(auth, 'recaptcha-container', {})
                )
                setConfirmationResult(result)
                return result
            } catch (err) {
                setError(err as AuthError)
            } finally {
                setLoading(false)
            }
        },
        [auth]
    )

    return {
        sendOtp,
        confirmationResult,
        sendOtpLoading: loading,
        sendOtpError: error,
    }
}

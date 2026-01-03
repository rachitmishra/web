'use client'
import { useCallback, useState } from 'react'
import { Auth, AuthError, signOut } from 'firebase/auth'

type ReturnType = [() => Promise<void>, boolean, AuthError | undefined]
export const useLoginWithPhoneNumber = (auth: Auth): ReturnType => {
    const [error, setError] = useState<AuthError>()
    const [loading, setLoading] = useState<boolean>(false)

    const logout = useCallback(async () => {
        setLoading(true)
        setError(undefined)
        try {
            await signOut(auth)
        } catch (err) {
            setError(err as AuthError)
        } finally {
            setLoading(false)
        }
    }, [auth])

    return [logout, loading, error]
}

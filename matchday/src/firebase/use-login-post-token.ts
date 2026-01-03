'use client'
import { useState } from 'react'
import { clientAuth } from '@/src/firebase/firebase-client'
import { User, signOut } from 'firebase/auth'
import { useRouter } from 'next/router'

export const useLoginPostToken = () => {
    const [error, setError] = useState<Error>()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const postToken = async (user: User) => {
        try {
            setLoading(true)
            const token = await user.getIdToken()
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.status === 200) {
                signOut(clientAuth)
                router.reload()
            } else {
            }
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }
    return {
        postToken,
        postTokenLoading: loading,
        postTokenError: error,
    }
}

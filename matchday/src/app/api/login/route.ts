import { auth } from 'firebase-admin'
import { cookies, headers } from 'next/headers'

export async function POST() {
    const authorization = headers().get('Authorization')
    if (authorization?.startsWith('Bearer ')) {
        const idToken = authorization.split('Bearer ')[1]
        const decodedToken = await auth().verifyIdToken(idToken)

        if (decodedToken) {
            const expiresIn = 60 * 60 * 24 * 5 * 1000
            const sessionCookie = await auth().createSessionCookie(idToken, {
                expiresIn,
            })
            const options = {
                name: 'session',
                value: sessionCookie,
                maxAge: expiresIn,
                httpOnly: true,
                secure: true,
            }

            cookies().set(options)
        }
    }

    return (
        new Response(),
        {
            status: 200,
            headers: { 'content-type': 'application/json' },
        }
    )
}

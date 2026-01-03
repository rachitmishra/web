import { cookies } from 'next/headers'

export async function POST() {
    cookies().delete('session')
    return (
        new Response(),
        {
            status: 200,
            headers: { 'content-type': 'application/json' },
        }
    )
}

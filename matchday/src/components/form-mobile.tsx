'use client'
import { useState } from 'react'
import { Input, Button, Spacer } from '@/src/design'

type Props = {
    buttonText: string
    onSubmit?: (phoneNumber: string) => void
}
export const MobileForm = ({ buttonText, onSubmit }: Props) => {
    const [phoneNumber, setPhoneNumber] = useState('')

    return (
        <div>
            <Input
                type={'tel'}
                name="phoneNumber"
                placeholder={'Phone Number'}
                prefix={'+91'}
                value={phoneNumber}
                onChange={setPhoneNumber}
            />
            <Spacer value={8} />
            <Button
                title={buttonText}
                onClick={() => onSubmit?.(phoneNumber)}
            />
        </div>
    )
}

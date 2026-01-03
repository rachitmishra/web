'use client'
import { useState } from 'react'
import { Input, Button, space, components } from '@/src/design'

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
            <div className={space._8} />
            <Button
                title={buttonText}
                onClick={() => onSubmit?.(phoneNumber)}
            />
        </div>
    )
}

'use client'
import { useState } from 'react'
import { Input, Button, Spacer } from '@/src/design'

type Props = {
    handleResendOtp?: () => void
    buttonText: string
    onSubmit?: (phoneNumber: string) => void
}
const OtpForm = ({ handleResendOtp, buttonText, onSubmit }: Props) => {
    const [code, setCode] = useState('')
    return (
        <div>
            <Input
                name="otp"
                type={'number'}
                placeholder={'Enter OTP'}
                onChange={setCode}
            />
            <Spacer />
            <Button title={buttonText} onClick={() => onSubmit?.(code)} />
            {/* <Button
                disabled={isResendDisabled}
                onClick={() => handleResendOtp?.()}
                title={`Resend OTP (${timer})`}
            /> */}
        </div>
    )
}
export default OtpForm

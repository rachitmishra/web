'use client'
import { useState } from 'react'
import { Button, InputOtp, components, space } from '@/src/design'

type Props = {
    handleResendOtp?: () => void
    buttonText: string
    onSubmit?: (phoneNumber: string) => void
}
const OtpForm = ({ handleResendOtp, buttonText, onSubmit }: Props) => {
    const [code, setCode] = useState('')
    return (
        <div className={components.center}>
            <InputOtp name={'otp'} />
            <div className={space._8} />
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

'use client'
import styles from './page.module.css'
import dynamic from 'next/dynamic'
import { Progress, Error, space, components, typography } from '@/src/design'
import { MobileForm } from '@/src/app/login/form-mobile'
import { useLoginSendOtp } from '@/src/firebase/use-login-send-otp'
import { clientAuth } from '@/src/firebase/firebase-client'
import { useLoginValidateOtp } from '@/src/firebase/use-login-validate-otp'
import { useLoginPostToken } from '@/src/firebase/use-login-post-token'
import { Banner } from '@/src/design/components/banner'

const OtpForm = dynamic(() => import('@/src/app/login/form-otp'), {
    loading: () => <Progress />,
})

const Page = () => {
    const { sendOtp, confirmationResult, sendOtpLoading, sendOtpError } =
        useLoginSendOtp(clientAuth)
    const {
        validateOtp,
        userCredential,
        validateOtpLoading,
        validateOtpError,
    } = useLoginValidateOtp()
    const { postToken } = useLoginPostToken()

    const isMobileFormVisible = !confirmationResult?.verificationId
    const isOtpFormVisible = confirmationResult?.verificationId

    if (userCredential) {
        postToken(userCredential.user)
        return
    }

    const errorMessage =
        sendOtpError?.message || validateOtpError?.message || ''

    return (
        <div className={components.page}>
            <div className={components.container}>
                {errorMessage && <Banner message={errorMessage} />}
                <div className={space._96} />
                <div className={typography.logo}>MatchDay</div>
                <div>
                    {!isOtpFormVisible && <div id="recaptcha-container" />}
                    <div className={space._24} />
                    {isMobileFormVisible && (
                        <MobileForm
                            buttonText={
                                sendOtpLoading ? 'Sending ...' : 'Send Otp'
                            }
                            onSubmit={(phoneNumber) => sendOtp(phoneNumber)}
                        />
                    )}
                </div>
                {true && (
                    <OtpForm
                        buttonText={
                            validateOtpLoading
                                ? 'Validating ...'
                                : 'Validate Otp'
                        }
                        onSubmit={(code) =>
                            validateOtp(confirmationResult, code)
                        }
                    />
                )}
            </div>
        </div>
    )
}

export default Page

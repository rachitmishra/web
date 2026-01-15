import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PhoneSignIn from '../components/ui/Auth/PhoneSignIn';
import OtpVerification from '../components/ui/Auth/OtpVerification';
import { signInWithPhone, verifyOtp } from '../services/authService';
import type { ConfirmationResult } from 'firebase/auth';
import Card from '../components/ui/Card/Card';

const Login: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handlePhoneSubmit = async (phoneNumber: string) => {
    console.log('handlePhoneSubmit triggered with:', phoneNumber);
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPhone(phoneNumber, 'recaptcha-container');
      console.log('signInWithPhone result:', result);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      console.error('signInWithPhone error:', err);
      setError(err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    if (!confirmationResult) return;
    setLoading(true);
    setError('');
    try {
      await verifyOtp(confirmationResult, otp);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'var(--spacing-8) auto' }}>
      <Card>
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
          {step === 'phone' ? 'Sign In' : 'Verify Code'}
        </h1>
        
        {error && (
          <div style={{ color: 'var(--color-danger)', marginBottom: 'var(--spacing-4)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <PhoneSignIn onSubmit={handlePhoneSubmit} loading={loading} />
        ) : (
          <OtpVerification onVerify={handleOtpVerify} loading={loading} />
        )}
      </Card>
    </div>
  );
};

export default Login;

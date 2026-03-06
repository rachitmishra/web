import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PhoneSignIn from '../components/ui/Auth/PhoneSignIn';
import OtpVerification from '../components/ui/Auth/OtpVerification';
import { signInWithPhone, verifyOtp } from '../services/authService';
import { getUserProfile } from '../services/profileService';
import Card from '../components/ui/Card/Card';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPhone(phoneNumber, 'recaptcha-container');
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
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
      const userCredential = await verifyOtp(confirmationResult, otp);
      const idToken = await userCredential.user.getIdToken();
      
      // Set the session cookie for SSR loaders
      document.cookie = `session=${idToken}; path=/; max-age=${60 * 60 * 24 * 5}; SameSite=Lax`;
      
      // Check user role
      const profile = await getUserProfile(userCredential.user.uid);
      
      if (profile?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.cardContent}>
          <div className={styles.illustration}>
            {step === 'phone' ? '✨' : '🔐'}
          </div>
          
          <h1 className={styles.title}>
            {step === 'phone' ? 'Welcome Back' : 'Security Check'}
          </h1>
          
          <p className={styles.subtitle}>
            {step === 'phone' 
              ? 'Sign in to access your boutique experience' 
              : 'Enter the code we sent to your mobile'}
          </p>
          
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <PhoneSignIn onSubmit={handlePhoneSubmit} loading={loading} />
          ) : (
            <OtpVerification onVerify={handleOtpVerify} loading={loading} />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSubmit, useActionData } from 'react-router-dom';
import PhoneSignIn from '../components/ui/Auth/PhoneSignIn';
import OtpVerification from '../components/ui/Auth/OtpVerification';
import { signInWithPhone, verifyOtp } from '../services/authService';
import { createSessionCookie } from '../lib/auth.server';
import { getSecureProfile } from '../services/profileService.server';
import Card from '../components/ui/Card/Card';
import styles from './Login.module.css';

/**
 * Server action to handle login and set secure session cookie.
 */
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const idToken = formData.get("idToken") as string;
  const uid = formData.get("uid") as string;

  if (!idToken || !uid) {
    return new Response(JSON.stringify({ success: false, error: "Missing required authentication data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // 1. Create secure session cookie
    const { cookie } = await createSessionCookie(idToken);
    
    // 2. Fetch profile for role-based redirect
    const profile = await getSecureProfile(uid);
    const role = profile?.role || 'user';

    return new Response(JSON.stringify({ success: true, role }), {
      headers: {
        "Set-Cookie": cookie,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("[Login Action] Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

const Login: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const submit = useSubmit();
  const actionData = useActionData() as { success: boolean, role: string, error?: string };
  
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get("from") || (location.state as any)?.from?.pathname || '/';

  // Force loading to false on mount to prevent stuck state
  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (actionData && typeof actionData === 'object') {
      if (actionData.success === true) {
        // Success! Role-based redirection
        const role = actionData.role;
        console.log(`[LoginPage] Login success! Role: ${role}`);

        if (role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          // Default to /profile for normal users if no specific 'from' path is provided
          const target = from === '/' ? '/profile' : from;
          navigate(target, { replace: true });
        }
      } else if (actionData.success === false) {
        if (actionData.error) {
          setError(actionData.error);
        }
        setLoading(false);
      }
    }
  }, [actionData, navigate, from]);

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPhone(phoneNumber, 'recaptcha-container');
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      if (err.code === 'auth/captcha-check-failed') {
        setError('Security check failed (hostname mismatch). Please ensure your domain/IP is added to Authorized Domains in Firebase Console.');
      } else {
        setError(err.message || 'Failed to send code');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    if (!confirmationResult) return;
    setLoading(true);
    setError('');
    try {
      console.log('[LoginPage] Verifying OTP...');
      const userCredential = await verifyOtp(confirmationResult, otp);
      
      if (!userCredential || !userCredential.user) {
        throw new Error('Login failed: No user data returned from Firebase.');
      }

      const idToken = await userCredential.user.getIdToken();
      console.log('[LoginPage] OTP verified, submitting to server action...');
      
      // Send token to server to set secure cookie
      submit({ idToken, uid: userCredential.user.uid }, { method: "post" });
    } catch (err: any) {
      console.error('[LoginPage] OTP Verification Error:', err);
      let errMsg = 'Invalid code. Please try again.';
      
      if (err.code === 'auth/invalid-verification-code') {
        errMsg = 'The verification code is incorrect. Please check and try again.';
      } else if (err.code === 'auth/code-expired') {
        errMsg = 'The verification code has expired. Please request a new one.';
      } else if (err.message) {
        errMsg = err.message;
      }
      
      setError(errMsg);
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

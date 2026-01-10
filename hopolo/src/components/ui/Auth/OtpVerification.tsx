import React, { useState } from 'react';
import Button from '../Button/Button';
import styles from './Auth.module.css';

interface OtpVerificationProps {
  onVerify: (otp: string) => void;
  loading?: boolean;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ onVerify, loading = false }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp) {
      onVerify(otp);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        placeholder="Enter verification code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        disabled={loading}
        required
      />
      <Button type="submit" loading={loading} disabled={loading || !otp}>
        {loading ? 'Loading...' : 'Verify'}
      </Button>
    </form>
  );
};

export default OtpVerification;

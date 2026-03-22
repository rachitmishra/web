import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import { clearRecaptcha } from '../../../services/authService';
import styles from './Auth.module.css';

interface PhoneSignInProps {
  onSubmit: (phoneNumber: string) => void;
  loading?: boolean;
}

const PhoneSignIn: React.FC<PhoneSignInProps> = ({ onSubmit, loading = false }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const [error, setError] = useState('');

  // Clean up reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      clearRecaptcha();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
      setError('');
      onSubmit(`+91${digitsOnly}`);
    } else {
      setError('Please enter a valid 10-digit number.');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
    if (value.length === 10) setError('');
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <span className={styles.prefix}>+91</span>
        <input
          type="tel"
          className={styles.phoneNumberInput}
          placeholder="Enter 10-digit mobile number"
          value={phoneNumber}
          onChange={handlePhoneChange}
          disabled={loading}
          required
          autoFocus
        />
      </div>
      {error && <div className={styles.localError}>{error}</div>}
      <div id="recaptcha-container"></div>
      <Button 
        type="submit" 
        loading={loading} 
        disabled={phoneNumber.length < 10 || loading}
      >
        {loading ? 'Sending...' : 'Send Code'}
      </Button>
    </form>
  );
};

export default PhoneSignIn;
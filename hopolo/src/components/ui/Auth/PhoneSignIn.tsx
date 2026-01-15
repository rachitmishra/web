import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import styles from './Auth.module.css';

interface PhoneSignInProps {
  onSubmit: (phoneNumber: string) => void;
  loading?: boolean;
}

const PhoneSignIn: React.FC<PhoneSignInProps> = ({ onSubmit, loading = false }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPhone = phoneNumber.trim();
    if (trimmedPhone) {
      onSubmit(trimmedPhone);
    }
  };

  // Improved disabled logic: check for trimmed length
  const isButtonDisabled = loading || phoneNumber.trim().length === 0;

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input
        type="tel"
        className={styles.input}
        placeholder="Phone Number (e.g. +1234567890)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        disabled={loading}
        required
        autoFocus
      />
      <div id="recaptcha-container"></div>
      <Button 
        type="submit" 
        loading={loading} 
        disabled={isButtonDisabled}
      >
        {loading ? 'Sending...' : 'Send Code'}
      </Button>
    </form>
  );
};

export default PhoneSignIn;
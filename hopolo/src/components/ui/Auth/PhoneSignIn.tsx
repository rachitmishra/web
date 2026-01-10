import React, { useState } from 'react';
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
    if (phoneNumber) {
      onSubmit(phoneNumber);
    }
  };

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
      />
      <div id="recaptcha-container"></div>
      <Button type="submit" loading={loading} disabled={loading || !phoneNumber}>
        {loading ? 'Sending...' : 'Send Code'}
      </Button>
    </form>
  );
};

export default PhoneSignIn;

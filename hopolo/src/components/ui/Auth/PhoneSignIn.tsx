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
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
      onSubmit(`+91${digitsOnly}`);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
  };

  // Button disabled if not exactly 10 digits
  const isButtonDisabled = loading || phoneNumber.length !== 10;

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
          pattern="[0-9]{10}"
        />
      </div>
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
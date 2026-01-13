import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from './encryption.server';

describe('Server-Side Encryption Utilities', () => {
  const secretKey = 'test_secret_key_32_chars_long_!!'; // exactly 32 chars

  it('should encrypt and decrypt a string correctly', () => {
    const originalText = 'Sensitive Data';
    const encrypted = encrypt(originalText, secretKey);
    
    expect(encrypted).toContain(':');
    expect(encrypted).not.toBe(originalText);

    const decrypted = decrypt(encrypted, secretKey);
    expect(decrypted).toBe(originalText);
  });

  it('should encrypt and decrypt an object correctly', () => {
    const originalData = { street: '123 Test St', city: 'Testerville' };
    const text = JSON.stringify(originalData);
    const encrypted = encrypt(text, secretKey);
    
    const decryptedText = decrypt(encrypted, secretKey);
    const decryptedData = JSON.parse(decryptedText);
    expect(decryptedData).toEqual(originalData);
  });

  it('should throw error for invalid key length', () => {
    expect(() => encrypt('test', 'short')).toThrow('Encryption key must be exactly 32 characters.');
  });
});

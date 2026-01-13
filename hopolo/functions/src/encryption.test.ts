import { describe, it, expect, vi } from 'vitest';
import { encrypt, decrypt } from './encryption';

describe('Encryption Utilities', () => {
  const secretKey = 'test_secret_key_32_chars_exactly_!!'; // Must be consistent with implementation

  it('should encrypt and decrypt a string correctly', () => {
    const originalText = 'Sensitive Data';
    const encrypted = encrypt(originalText, secretKey);
    expect(encrypted).toBeDefined();
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
});

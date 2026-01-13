import * as CryptoJS from 'crypto-js';

/**
 * Encrypts a string using AES-256.
 * @param text The plain text to encrypt.
 * @param secretKey The secret key for encryption.
 * @returns The base64 encoded encrypted string.
 */
export const encrypt = (text: string, secretKey: string): string => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

/**
 * Decrypts an AES-256 encrypted string.
 * @param ciphertext The encrypted string (base64).
 * @param secretKey The secret key for decryption.
 * @returns The decrypted plain text.
 */
export const decrypt = (ciphertext: string, secretKey: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Encrypts a string using AES-256-CBC.
 * @param text The plain text to encrypt.
 * @param secretKey The 32-character secret key.
 * @returns The encrypted string in format 'iv:ciphertext'.
 */
export function encrypt(text: string, secretKey: string): string {
  if (secretKey.length !== 32) {
    throw new Error('Encryption key must be exactly 32 characters.');
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(secretKey), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts a string encrypted with 'iv:ciphertext'.
 * @param encryptedText The encrypted string.
 * @param secretKey The 32-character secret key.
 * @returns The decrypted plain text.
 */
export function decrypt(encryptedText: string, secretKey: string): string {
  if (secretKey.length !== 32) {
    throw new Error('Encryption key must be exactly 32 characters.');
  }

  const [ivHex, ciphertext] = encryptedText.split(':');
  if (!ivHex || !ciphertext) {
    throw new Error('Invalid encrypted text format.');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(secretKey), iv);
  
  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

import { adminDb } from '../lib/firebase-admin.server';
import { decrypt } from '../lib/encryption.server';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'test_secret_key_32_chars_long_!!'; // fallback for dev

export interface SecureProfile {
  uid: string;
  email: string;
  phoneNumber?: string;
  role: string;
  displayName: string;
  emoji: string;
  addresses: any[];
}

/**
 * Fetches and decrypts a user profile from Firestore.
 */
export async function getSecureProfile(uid: string): Promise<SecureProfile | null> {
  const doc = await adminDb.collection('profiles').doc(uid).get();
  
  if (!doc.exists) {
    return null;
  }

  const data = doc.data()!;
  const key = ENCRYPTION_KEY;

  try {
    return {
      uid,
      email: data.email || '',
      phoneNumber: data.phoneNumber || '',
      role: data.role || 'user',
      displayName: data.displayName ? decrypt(data.displayName, key) : '',
      emoji: data.emoji ? decrypt(data.emoji, key) : '',
      addresses: data.addresses ? JSON.parse(decrypt(data.addresses, key)) : []
    };
  } catch (error) {
    console.error(`Failed to decrypt profile for ${uid}:`, error);
    // If decryption fails (e.g. invalid key), return raw or partial?
    // For security, we probably should return null or throw.
    return null;
  }
}

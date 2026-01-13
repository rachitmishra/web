import { adminDb } from '../lib/firebase-admin.server';
import { encrypt, decrypt } from '../lib/encryption.server';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

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
    return null;
  }
}

/**
 * Encrypts and updates a user profile in Firestore.
 */
export async function updateSecureProfile(uid: string, updates: Partial<SecureProfile>): Promise<void> {
  const key = ENCRYPTION_KEY;
  const updateData: any = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  if (updates.displayName !== undefined) {
    updateData.displayName = encrypt(updates.displayName, key);
  }
  if (updates.emoji !== undefined) {
    updateData.emoji = encrypt(updates.emoji, key);
  }
  if (updates.addresses !== undefined) {
    updateData.addresses = encrypt(JSON.stringify(updates.addresses), key);
  }

  await adminDb.collection('profiles').doc(uid).update(updateData);
}

/**
 * Creates an invitation for a specific phone number and role.
 */
export async function createInvitation(creatorUid: string, phoneNumber: string, role: string) {
  const creatorProfile = await adminDb.collection('profiles').doc(creatorUid).get();
  
  if (!creatorProfile.exists || creatorProfile.data()?.role !== 'admin') {
    throw new Error('Only admins can create invitations.');
  }

  const inviteCode = uuidv4().substring(0, 8).toUpperCase();
  
  await adminDb.collection('invitations').add({
    phoneNumber,
    role,
    inviteCode,
    status: 'pending',
    createdBy: creatorUid,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { inviteCode };
}
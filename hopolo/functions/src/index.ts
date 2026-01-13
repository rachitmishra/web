import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { encrypt, decrypt } from './encryption';
import { getConfig } from './config';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export const onUserCreated = async (user: admin.auth.UserRecord) => {
  const { uid, email } = user;
  
  await db.collection('profiles').doc(uid).set({
    uid,
    email: email || '',
    role: 'user',
    addresses: encrypt(JSON.stringify([]), getConfig().encryptionKey),
    displayName: encrypt('', getConfig().encryptionKey),
    emoji: encrypt('', getConfig().encryptionKey),
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
};

// Export the Cloud Function trigger (v1 style)
export const userCreatedTrigger = functions.auth.user().onCreate(onUserCreated);

/**
 * Handler for retrieving a decrypted user profile.
 */
export const getSecureProfileHandler = async (request: any) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const uid = request.auth.uid;
  const profileDoc = await db.collection('profiles').doc(uid).get();

  if (!profileDoc.exists) {
    throw new HttpsError('not-found', 'Profile not found.');
  }

  const data = profileDoc.data()!;
  const key = getConfig().encryptionKey;

  return {
    ...data,
    displayName: data.displayName ? decrypt(data.displayName, key) : '',
    emoji: data.emoji ? decrypt(data.emoji, key) : '',
    addresses: data.addresses ? JSON.parse(decrypt(data.addresses, key)) : []
  };
};

/**
 * Handler for updating an encrypted user profile.
 */
export const updateSecureProfileHandler = async (request: any) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const uid = request.auth.uid;
  const { displayName, emoji, addresses } = request.data;
  const key = getConfig().encryptionKey;

  const updateData: any = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  if (displayName !== undefined) updateData.displayName = encrypt(displayName, key);
  if (emoji !== undefined) updateData.emoji = encrypt(emoji, key);
  if (addresses !== undefined) updateData.addresses = encrypt(JSON.stringify(addresses), key);

  await db.collection('profiles').doc(uid).update(updateData);

  return { success: true };
};

// Export the Cloud Function callables (v2 style)
export const getSecureProfile = onCall(getSecureProfileHandler);
export const updateSecureProfile = onCall(updateSecureProfileHandler);

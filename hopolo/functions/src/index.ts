import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { encrypt, decrypt } from './encryption';
import { getConfig } from './config';
import { v4 as uuidv4 } from 'uuid';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export const onUserCreated = async (user: admin.auth.UserRecord) => {
  const { uid, email, phoneNumber } = user;
  const key = getConfig().encryptionKey;

  // Check for invitations
  let role = 'user';
  if (phoneNumber) {
    const inviteQuery = await db.collection('invitations')
      .where('phoneNumber', '==', phoneNumber)
      .where('status', '==', 'pending')
      .get();
    
    if (!inviteQuery.empty) {
      const inviteDoc = inviteQuery.docs[0];
      role = inviteDoc.data().role;
      await inviteDoc.ref.update({ status: 'consumed', usedBy: uid, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    }
  }
  
  await db.collection('profiles').doc(uid).set({
    uid,
    email: email || '',
    phoneNumber: phoneNumber || '',
    role,
    addresses: encrypt(JSON.stringify([]), key),
    displayName: encrypt('', key),
    emoji: encrypt('', key),
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

/**
 * Handler for creating an admin invitation.
 */
export const createInviteHandler = async (request: any) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const callerUid = request.auth.uid;
  const callerProfile = await db.collection('profiles').doc(callerUid).get();

  if (!callerProfile.exists || callerProfile.data()?.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Only admins can create invitations.');
  }

  const { phoneNumber, role } = request.data;
  if (!phoneNumber || !role) {
    throw new HttpsError('invalid-argument', 'Phone number and role are required.');
  }

  const inviteCode = uuidv4().substring(0, 8).toUpperCase();
  
  await db.collection('invitations').add({
    phoneNumber,
    role,
    inviteCode,
    status: 'pending',
    createdBy: callerUid,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { inviteCode };
};

// Export the Cloud Function callables (v2 style)
export const getSecureProfile = onCall(getSecureProfileHandler);
export const updateSecureProfile = onCall(updateSecureProfileHandler);
export const createInvite = onCall(createInviteHandler);
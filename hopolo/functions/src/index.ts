import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

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
    addresses: [],
    displayName: '',
    emoji: '',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
};

// Export the Cloud Function trigger (v1 style)
export const userCreatedTrigger = functions.auth.user().onCreate(onUserCreated);
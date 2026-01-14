import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    // When running in Firebase environment or with GOOGLE_APPLICATION_CREDENTIALS,
    // it will automatically find the credentials.
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

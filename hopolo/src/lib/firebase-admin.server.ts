import admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import fs from 'node:fs';
import path from 'node:path';

if (!admin.apps.length) {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error('[Firebase Admin] VITE_FIREBASE_PROJECT_ID is missing! Firebase Admin will likely fail.');
  }

  const serviceAccountPath = path.resolve(process.cwd(), 'service-account-secret.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${projectId}.firebasestorage.app`
      });
    } catch (err) {
      console.error('[Firebase Admin] Failed to initialize with service account file:', err);
      admin.initializeApp({
        projectId: projectId,
        storageBucket: `${projectId}.firebasestorage.app`
      });
    }
  } else {
    admin.initializeApp({
      projectId: projectId,
      storageBucket: `${projectId}.firebasestorage.app`
    });
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();
export { FieldValue, admin };

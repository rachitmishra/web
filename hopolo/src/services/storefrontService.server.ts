import { adminDb } from '../lib/firebase-admin.server';
import { type StorefrontSettings, DEFAULT_SETTINGS } from './storefrontService';

const SETTINGS_DOC_ID = 'storefront';
const SETTINGS_COLLECTION = 'settings';

export const getStorefrontSettings = async (): Promise<StorefrontSettings> => {
  const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOC_ID);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return { ...DEFAULT_SETTINGS, ...docSnap.data() } as StorefrontSettings;
  }
  return DEFAULT_SETTINGS;
};

export const updateStorefrontSettings = async (settings: Partial<StorefrontSettings>): Promise<void> => {
  const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOC_ID);
  await docRef.set(settings, { merge: true });
};

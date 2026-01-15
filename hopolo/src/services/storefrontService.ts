import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface StorefrontSettings {
  bannerText: string;
  bannerColor: string;
  bannerLink: string;
  bannerVisible: boolean;
  isMaintenanceMode: boolean;
}

const SETTINGS_DOC_ID = 'storefront';
const SETTINGS_COLLECTION = 'settings';

export const getStorefrontSettings = async (): Promise<StorefrontSettings | null> => {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as StorefrontSettings;
  }
  return null;
};

export const updateStorefrontSettings = async (settings: Partial<StorefrontSettings>): Promise<void> => {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  await setDoc(docRef, settings, { merge: true });
};

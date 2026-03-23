import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CustomerReview {
  name: string;
  emoji: string;
  text: string;
}

export interface StorefrontSettings {
  bannerText: string;
  bannerColor: string;
  bannerLink: string;
  bannerVisible: boolean;
  isMaintenanceMode: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaText: string;
  reviews: CustomerReview[];
}

export const DEFAULT_SETTINGS: StorefrontSettings = {
  bannerText: "Welcome to Hopolo!",
  bannerColor: "#5D3FD3",
  bannerLink: "",
  bannerVisible: false,
  isMaintenanceMode: false,
  heroTitle: "Hopolo Boutique",
  heroSubtitle: "Discover unique products curated just for you. Minimalist design, playful details.",
  heroImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80&fm=webp",
  heroCtaText: "Shop the Collection",
  reviews: [
    {
      name: "Sarah L.",
      emoji: "😊",
      text: "Amazing quality and fast delivery. Highly recommended!",
    },
    {
      name: "Marcus T.",
      emoji: "😊",
      text: "Minimalist design that fits perfectly in my home.",
    },
    {
      name: "Elena G.",
      emoji: "😊",
      text: "The emoji-based review system is so fun and easy!",
    },
  ],
};

const SETTINGS_DOC_ID = 'storefront';
const SETTINGS_COLLECTION = 'settings';

export const getStorefrontSettings = async (): Promise<StorefrontSettings> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...DEFAULT_SETTINGS, ...docSnap.data() } as StorefrontSettings;
    } else {
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error("Error fetching storefront settings:", error);
    return DEFAULT_SETTINGS;
  }
};

export const updateStorefrontSettings = async (settings: Partial<StorefrontSettings>): Promise<void> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
  } catch (error) {
    console.error("Error updating storefront settings:", error);
    throw error;
  }
};

export const subscribeToStorefrontSettings = (
  callback: (settings: StorefrontSettings) => void
): (() => void) => {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ ...DEFAULT_SETTINGS, ...docSnap.data() } as StorefrontSettings);
    } else {
      callback(DEFAULT_SETTINGS);
    }
  }, (error) => {
    console.error("Error subscribing to storefront settings:", error);
  });
};

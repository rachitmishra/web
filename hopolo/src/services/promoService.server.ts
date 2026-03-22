import { adminDb } from '../lib/firebase-admin.server';
import { type PromoCode } from './promoService';

export const fetchPromoCodes = async (): Promise<PromoCode[]> => {
  const snapshot = await adminDb.collection('promo_codes').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as PromoCode[];
};

export const addPromoCode = async (promo: Omit<PromoCode, 'id'>): Promise<string> => {
  const docRef = await adminDb.collection('promo_codes').add({
    ...promo,
    code: promo.code.toUpperCase()
  });
  return docRef.id;
};

export const deletePromoCode = async (id: string): Promise<void> => {
  await adminDb.collection('promo_codes').doc(id).delete();
};

export const validatePromoCode = async (code: string, cartTotal: number) => {
  const snapshot = await adminDb.collection('promo_codes')
    .where('code', '==', code.toUpperCase())
    .limit(1)
    .get();

  if (snapshot.empty) {
    throw new Error('Invalid promo code');
  }

  const promoData = snapshot.docs[0].data() as PromoCode;

  if (promoData.minPurchase && cartTotal < promoData.minPurchase) {
    throw new Error(`Minimum purchase of $${promoData.minPurchase} required`);
  }

  let discount = 0;
  if (promoData.type === 'percentage') {
    discount = (cartTotal * promoData.value) / 100;
  } else {
    discount = promoData.value;
  }

  return {
    discount,
    type: promoData.type,
    value: promoData.value
  };
};

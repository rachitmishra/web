import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
}

export const validatePromoCode = async (code: string, cartTotal: number) => {
  const q = query(
    collection(db, 'promo_codes'),
    where('code', '==', code.toUpperCase())
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('Invalid promo code');
  }

  const promoData = querySnapshot.docs[0].data() as PromoCode;

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

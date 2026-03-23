import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PromoCode {
  id?: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
}

export const validatePromoCode = async (code: string, cartTotal: number): Promise<{ code: string; discount: number }> => {
  const q = query(collection(db, 'promos'), where('code', '==', code.toUpperCase()));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('Invalid promo code');
  }

  const promoDoc = querySnapshot.docs[0];
  const promoData = promoDoc.data() as PromoCode;

  if (promoData.minPurchase && cartTotal < promoData.minPurchase) {
    throw new Error(`Minimum purchase amount of $${promoData.minPurchase} required`);
  }

  let discount = 0;
  if (promoData.type === 'percentage') {
    discount = cartTotal * (promoData.value / 100);
  } else if (promoData.type === 'fixed') {
    discount = promoData.value;
  }

  return {
    code: promoData.code,
    discount
  };
};

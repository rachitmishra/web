import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PromoCode {
  id?: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
}

export const fetchPromoCodes = async (): Promise<PromoCode[]> => {
  const querySnapshot = await getDocs(collection(db, 'promo_codes'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as PromoCode[];
};

export const addPromoCode = async (promo: PromoCode): Promise<string> => {
  const docRef = await addDoc(collection(db, 'promo_codes'), {
    ...promo,
    code: promo.code.toUpperCase()
  });
  return docRef.id;
};

export const deletePromoCode = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'promo_codes', id));
};

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

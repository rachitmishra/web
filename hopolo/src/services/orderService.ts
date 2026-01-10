import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CartItem } from './cartService';
import { Address } from './profileService';

export interface Order {
  userId: string;
  items: CartItem[];
  total: number;
  paymentId: string;
  status: 'paid' | 'pending' | 'failed';
  address: Address;
  createdAt: any;
}

export const createOrder = async (orderData: Omit<Order, 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CartItem } from './cartService';
import { Address } from './profileService';

export interface Order {
  id: string; // Include id
  userId: string;
  items: CartItem[];
  total: number;
  paymentId: string;
  status: 'paid' | 'pending' | 'failed' | 'shipped' | 'delivered' | 'refunded'; // Updated status
  address: Address;
  createdAt: any;
}

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Order[];
};

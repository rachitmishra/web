import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  rating?: number;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};

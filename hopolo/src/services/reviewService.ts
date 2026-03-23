import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Review {
  id?: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 3, 2, 1
  comment: string;
  createdAt?: any;
}

export const addReview = async (review: Omit<Review, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'reviews'), {
    ...review,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const fetchReviews = async (productId: string): Promise<Review[]> => {
  const q = query(
    collection(db, 'reviews'),
    where('productId', '==', productId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Review[];
};

import { adminDb, FieldValue } from '../lib/firebase-admin.server';
import { type Review } from './reviewService';

export const fetchReviews = async (productId: string): Promise<Review[]> => {
  const snapshot = await adminDb.collection('reviews')
    .where('productId', '==', productId)
    .orderBy('createdAt', 'desc')
    .get();
    
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Review[];
};

export const addReview = async (review: Omit<Review, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await adminDb.collection('reviews').add({
    ...review,
    createdAt: FieldValue.serverTimestamp()
  });
  return docRef.id;
};

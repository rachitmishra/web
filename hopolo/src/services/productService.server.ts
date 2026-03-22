import { adminDb } from '../lib/firebase-admin.server';
import type { Product } from './productService';

export const fetchProducts = async (): Promise<Product[]> => {
  const snapshot = await adminDb.collection('products').get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      images: data.images || (data.image ? [data.image] : []),
      variants: data.variants || [],
    } as Product;
  });
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const doc = await adminDb.collection('products').doc(id).get();
  if (doc.exists) {
    const data = doc.data()!;
    return {
      id: doc.id,
      ...data,
      images: data.images || (data.image ? [data.image] : []),
      variants: data.variants || [],
    } as Product;
  }
  return null;
};

export const fetchCategories = async (): Promise<any[]> => {
  const snapshot = await adminDb.collection('categories').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const fetchBestSellers = async (): Promise<Product[]> => {
  const snapshot = await adminDb.collection('products')
    .where('isBestSeller', '==', true)
    .get();
    
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      images: data.images || (data.image ? [data.image] : []),
      variants: data.variants || [],
    } as Product;
  });
};

export const saveProduct = async (productData: any): Promise<string> => {
  const docRef = await adminDb.collection('products').add({
    ...productData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
};

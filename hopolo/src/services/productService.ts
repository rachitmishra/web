import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Variant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  title: string;
  price: number;
  category: string;
  isBestSeller?: boolean;
  description?: string;
  images?: string[];
  image?: string;
  rating?: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  deliveryDetails?: string;
  deliveryTime?: string;
  priceDisclaimer?: string;
  specifications?: Record<string, string>;
  artDetails?: Record<string, string>;
  variants?: Variant[];
  sizes?: string[];
  colors?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  name: string;
}

export const saveProduct = async (productData: Partial<Product>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'products'), productData);
  return docRef.id;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const querySnapshot = await getDocs(collection(db, 'categories'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })) as Category[];
};

export const fetchBestSellers = async (): Promise<Product[]> => {
  const q = query(collection(db, 'products'), where('isBestSeller', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
};

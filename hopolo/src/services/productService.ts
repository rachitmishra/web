import { collection, getDocs } from 'firebase/firestore';
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
  title: string; // Often same as name, but spec mentioned Title
  price: number;
  category: string;
  description?: string;
  images?: string[]; // Multiple images
  image?: string; // Primary image (backward compat)
  rating?: number;
  
  // Promotion
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  
  // Logistics & Policy
  deliveryDetails?: string;
  deliveryTime?: string;
  priceDisclaimer?: string;
  
  // Specs
  specifications?: Record<string, string>;
  artDetails?: Record<string, string>;
  
  // Variants
  variants?: Variant[];
  sizes?: string[]; // Derived/Cached for filtering
  colors?: string[]; // Derived/Cached for filtering
  
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  name: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Ensure arrays are initialized if missing
      images: data.images || (data.image ? [data.image] : []),
      variants: data.variants || [],
    } as Product;
  });
};

export const fetchCategories = async (): Promise<Category[]> => {
  const querySnapshot = await getDocs(collection(db, 'categories'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Category[];
};
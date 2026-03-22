import { onSnapshot, doc, type Unsubscribe } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getSessionId } from '../lib/session';
import type { Product } from './productService';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  items: CartItem[];
}

const getCartRef = () => {
  const sessionId = getSessionId();
  return doc(db, 'carts', sessionId);
};

export const subscribeToCart = (callback: (items: CartItem[]) => void): Unsubscribe => {
  return onSnapshot(getCartRef(), (doc) => {
    if (doc.exists()) {
      const data = doc.data() as Cart;
      callback(data.items || []);
    } else {
      callback([]);
    }
  });
};

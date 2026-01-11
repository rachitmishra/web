import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getSessionId } from '../lib/session';
import { Product } from './productService';

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
      callback((doc.data() as Cart).items);
    } else {
      callback([]);
    }
  });
};

export const addToCart = async (product: Product, quantity: number, options?: { size?: string; color?: string }) => {
  const cartRef = getCartRef();
  const cartDoc = await getDoc(cartRef);
  let items: CartItem[] = [];

  if (cartDoc.exists()) {
    items = (cartDoc.data() as Cart).items;
  }

  const existingItemIndex = items.findIndex((item) => {
    const isSameProduct = item.product.id === product.id;
    const isSameSize = item.selectedSize === options?.size;
    const isSameColor = item.selectedColor === options?.color;
    return isSameProduct && isSameSize && isSameColor;
  });

  if (existingItemIndex > -1) {
    items[existingItemIndex].quantity += quantity;
  } else {
    items.push({ 
      product, 
      quantity,
      ...(options?.size && { selectedSize: options.size }),
      ...(options?.color && { selectedColor: options.color })
    });
  }

  await setDoc(cartRef, { items });
};

export const removeFromCart = async (productId: string) => {
  const cartRef = getCartRef();
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    const items = (cartDoc.data() as Cart).items.filter((item) => item.product.id !== productId);
    await setDoc(cartRef, { items });
  }
};

export const updateQuantity = async (productId: string, quantity: number) => {
  const cartRef = getCartRef();
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    const items = (cartDoc.data() as Cart).items.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    await setDoc(cartRef, { items });
  }
};

export const clearCart = async () => {
  const cartRef = getCartRef();
  await setDoc(cartRef, { items: [] });
};

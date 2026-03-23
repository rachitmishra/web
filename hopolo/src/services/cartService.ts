import { onSnapshot, doc, getDoc, setDoc, updateDoc, type Unsubscribe } from 'firebase/firestore';
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

export const getCartItems = async (): Promise<CartItem[]> => {
  const docSnap = await getDoc(getCartRef());
  if (docSnap.exists()) {
    const data = docSnap.data() as Cart;
    return data.items || [];
  }
  return [];
};

export const addToCart = async (
  product: Product,
  quantity: number,
  selectedSize?: string,
  selectedColor?: string
) => {
  const cartRef = getCartRef();
  const items = await getCartItems();

  const existingItemIndex = items.findIndex(
    item => item.product.id === product.id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
  );

  if (existingItemIndex > -1) {
    items[existingItemIndex].quantity += quantity;
  } else {
    items.push({ product, quantity, selectedSize, selectedColor });
  }

  await setDoc(cartRef, { items }, { merge: true });
};

export const updateCartItemQuantity = async (
  productId: string,
  quantity: number,
  selectedSize?: string,
  selectedColor?: string
) => {
  const cartRef = getCartRef();
  const items = await getCartItems();

  const updatedItems = items.map(item => {
    if (item.product.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor) {
      return { ...item, quantity };
    }
    return item;
  });

  await updateDoc(cartRef, { items: updatedItems });
};

export const removeFromCart = async (
  productId: string,
  selectedSize?: string,
  selectedColor?: string
) => {
  const cartRef = getCartRef();
  const items = await getCartItems();

  const updatedItems = items.filter(
    item => !(item.product.id === productId &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor)
  );

  await updateDoc(cartRef, { items: updatedItems });
};

export const clearCart = async () => {
  const cartRef = getCartRef();
  await setDoc(cartRef, { items: [] });
};

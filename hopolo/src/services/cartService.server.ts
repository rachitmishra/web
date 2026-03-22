import { adminDb } from '../lib/firebase-admin.server';
import { type CartItem, type Cart } from './cartService';
import { type Product } from './productService';

const getCartRef = (sessionId: string) => {
  return adminDb.collection('carts').doc(sessionId);
};

export const getCart = async (sessionId: string): Promise<CartItem[]> => {
  if (!sessionId) return [];
  const doc = await getCartRef(sessionId).get();
  if (doc.exists) {
    return (doc.data() as Cart).items || [];
  }
  return [];
};

export const addToCart = async (sessionId: string, product: Product, quantity: number, options?: { size?: string; color?: string }) => {
  if (!sessionId) throw new Error('Session ID required');
  
  const cartRef = getCartRef(sessionId);
  const cartDoc = await cartRef.get();
  let items: CartItem[] = [];

  if (cartDoc.exists) {
    items = (cartDoc.data() as Cart).items || [];
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

  await cartRef.set({ items }, { merge: true });
};

export const removeFromCart = async (sessionId: string, productId: string, options?: { size?: string; color?: string }) => {
  if (!sessionId) return;
  const cartRef = getCartRef(sessionId);
  const cartDoc = await cartRef.get();

  if (cartDoc.exists) {
    const items = (cartDoc.data() as Cart).items.filter((item) => {
      const isSameProduct = item.product.id === productId;
      const isSameSize = !options?.size || item.selectedSize === options.size;
      const isSameColor = !options?.color || item.selectedColor === options.color;
      return !(isSameProduct && isSameSize && isSameColor);
    });
    await cartRef.set({ items }, { merge: true });
  }
};

export const updateQuantity = async (sessionId: string, productId: string, quantity: number, options?: { size?: string; color?: string }) => {
  if (!sessionId) return;
  const cartRef = getCartRef(sessionId);
  const cartDoc = await cartRef.get();

  if (cartDoc.exists) {
    const items = (cartDoc.data() as Cart).items.map((item) => {
      const isSameProduct = item.product.id === productId;
      const isSameSize = !options?.size || item.selectedSize === options.size;
      const isSameColor = !options?.color || item.selectedColor === options.color;
      
      if (isSameProduct && isSameSize && isSameColor) {
        return { ...item, quantity };
      }
      return item;
    });
    await cartRef.set({ items }, { merge: true });
  }
};

export const clearCart = async (sessionId: string) => {
  if (!sessionId) return;
  const cartRef = getCartRef(sessionId);
  await cartRef.set({ items: [] });
};

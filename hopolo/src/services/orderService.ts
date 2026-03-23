import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CartItem } from "./cartService";
import type { Address } from "./profileService";
import { sendEmail } from "./emailService";
import { getOrderConfirmationEmailHtml } from '../templates/orderConfirmation';
import { getDeliveryFeedbackHtml } from '../templates/deliveryFeedback';

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  items: CartItem[];
  total: number;
  paymentId: string;
  status: "paid" | "pending" | "failed" | "shipped" | "delivered" | "refunded";
  address: Address;
  createdAt: any;
}

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: serverTimestamp()
  });

  if (orderData.userEmail) {
    try {
      await sendEmail({
        to: orderData.userEmail,
        subject: 'Order Confirmed - Hopolo',
        html: getOrderConfirmationEmailHtml({ id: docRef.id, ...orderData } as any)
      });
    } catch (e) {
      console.error("Failed to send order confirmation email", e);
    }
  }

  return docRef.id;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const docRef = doc(db, 'orders', orderId);
  await updateDoc(docRef, { status });

  if (status === 'delivered') {
    try {
      const order = await fetchOrderById(orderId);
      if (order && order.userEmail) {
        await sendEmail({
          to: order.userEmail,
          subject: 'Your order has arrived! 📦',
          html: getDeliveryFeedbackHtml(order)
        });
      }
    } catch (e) {
      console.error("Failed to send delivery feedback email", e);
    }
  }
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
};

export const fetchOrderById = async (orderId: string): Promise<Order | null> => {
  const docRef = doc(db, 'orders', orderId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Order;
  }
  return null;
};

export const fetchOrdersByUser = async (userId: string): Promise<Order[]> => {
  const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
};

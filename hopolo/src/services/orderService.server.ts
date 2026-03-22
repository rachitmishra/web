import { adminDb, FieldValue } from '../lib/firebase-admin.server';
import { type Order } from './orderService';
import { sendEmail } from './emailService.server';
import { generateOrderConfirmationHtml } from '../templates/orderConfirmation';
import { generateDeliveryFeedbackHtml } from '../templates/deliveryFeedback';

export const fetchAllOrders = async (): Promise<Order[]> => {
  const snapshot = await adminDb.collection('orders')
    .orderBy('createdAt', 'desc')
    .get();
    
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Order[];
};

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  const doc = await adminDb.collection('orders').doc(orderId).get();
  if (doc.exists) {
    return { id: doc.id, ...doc.data() } as Order;
  }
  return null;
}

export const fetchOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const snapshot = await adminDb.collection('orders')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
    
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Order[];
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
): Promise<void> => {
  const docRef = adminDb.collection("orders").doc(orderId);
  await docRef.update({ status });

  if (status === "delivered") {
    try {
      const orderSnap = await docRef.get();
      if (orderSnap.exists) {
        const orderData = orderSnap.data() as Order;
        if (orderData.userEmail) {
          const html = generateDeliveryFeedbackHtml(orderId);
          await sendEmail({
            to: orderData.userEmail,
            subject: "Your order has arrived! 📦",
            html,
          });
        }
      }
    } catch (error) {
      console.error("Failed to send delivery feedback email:", error);
    }
  }
};

export const createOrder = async (
  orderData: Omit<Order, "id" | "createdAt">
): Promise<string> => {
  const docRef = await adminDb.collection("orders").add({
    ...orderData,
    createdAt: FieldValue.serverTimestamp(),
  });

  // Trigger Order Confirmation Email
  if (orderData.userEmail && orderData.status === "paid") {
    try {
      const html = generateOrderConfirmationHtml({
        id: docRef.id,
        items: orderData.items,
        total: orderData.total,
        address: orderData.address,
      });
      await sendEmail({
        to: orderData.userEmail,
        subject: "Order Confirmed - Hopolo",
        html,
      });
    } catch (error) {
      console.error("Failed to send order confirmation email:", error);
    }
  }

  return docRef.id;
};

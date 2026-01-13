import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { CartItem } from "./cartService";
import type { Address } from "./profileService";
import { sendEmail } from "./emailService";
import { generateOrderConfirmationHtml } from "../templates/orderConfirmation";
import { generateDeliveryFeedbackHtml } from "../templates/deliveryFeedback";

export interface Order {
  id: string; // Include id
  userId: string;
  userEmail?: string;
  items: CartItem[];
  total: number;
  paymentId: string;
  status: "paid" | "pending" | "failed" | "shipped" | "delivered" | "refunded"; // Updated status
  address: Address;
  createdAt: any;
}

export const createOrder = async (
  orderData: Omit<Order, "id" | "createdAt">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    createdAt: serverTimestamp(),
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

export const fetchAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
};

export const fetchOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
): Promise<void> => {
  const docRef = doc(db, "orders", orderId);
  await updateDoc(docRef, { status });

  if (status === "delivered") {
    try {
      const orderSnap = await getDoc(docRef);
      if (orderSnap.exists()) {
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

export async function fetchOrderById(orderId: string) {
  const docRef = doc(db, "orders", orderId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

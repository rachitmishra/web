import type { CartItem } from "./cartService";
import type { Address } from "./profileService";

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

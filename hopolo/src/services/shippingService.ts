export interface ShippingOrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  items: Array<{ name: string; qty: number; price: number }>;
}

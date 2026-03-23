export interface ShippingOrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  items: Array<{ name: string; qty: number; price: number }>;
}

export const createShippingOrder = async (orderDetails: ShippingOrderDetails) => {
  const apiKey = process.env.VITE_SHADOWFAX_API_KEY || import.meta.env.VITE_SHADOWFAX_API_KEY;
  const apiUrl = process.env.VITE_SHADOWFAX_API_URL || import.meta.env.VITE_SHADOWFAX_API_URL;

  const response = await fetch(`${apiUrl}/api/v2/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderDetails)
  });

  if (!response.ok) {
    throw new Error(`Shadowfax API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    trackingId: data.data.waybill_number,
    labelUrl: data.data.label_url
  };
};

import { type ShippingOrderDetails } from './shippingService';

export async function createShippingOrder(details: ShippingOrderDetails) {
  const apiKey = process.env.VITE_SHADOWFAX_API_KEY;
  const apiUrl = process.env.VITE_SHADOWFAX_API_URL || 'https://api.shadowfax.in';

  if (!apiKey) {
    console.warn("VITE_SHADOWFAX_API_KEY is missing. Using mock response.");
    return {
      trackingId: `MOCK-${details.orderId}`,
      labelUrl: '#'
    };
  }

  const response = await fetch(`${apiUrl}/api/v1/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_order_number: details.orderId,
      customer_name: details.customerName,
      customer_phone: details.phone,
      delivery_address: details.address,
      order_items: details.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.qty
      }))
    })
  });

  if (!response.ok) {
    throw new Error(`Shadowfax API error: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    trackingId: data.data.waybill_number,
    labelUrl: data.data.label_url
  };
}

export interface OrderDetails {
  id: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  address: {
    street: string;
    city: string;
    zip: string;
  };
}

export const generateOrderConfirmationHtml = (order: OrderDetails): string => {
  const itemsHtml = order.items.map(item => `
    <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
      <strong>${item.name}</strong> x ${item.quantity} - ₹${item.price * item.quantity}
    </div>
  `).join('');

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Order Confirmed! 🎉</h1>
      <p>Thank you for your purchase. Here are your order details:</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Order #${order.id}</h2>
        ${itemsHtml}
        <div style="margin-top: 15px; text-align: right; font-size: 1.2em; font-weight: bold;">
          Total: ₹${order.total}
        </div>
      </div>

      <div style="margin-top: 20px;">
        <h3>Shipping Address:</h3>
        <p>
          ${order.address.street}<br/>
          ${order.address.city}, ${order.address.zip}
        </p>
      </div>

      <p style="color: #666; font-size: 0.9em; margin-top: 40px;">
        Expected delivery: 3-5 business days.
      </p>
    </div>
  `;
};

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export async function refundOrder(paymentId: string, amount: number) {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET;

  const auth = btoa(`${keyId}:${keySecret}`);

  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount })
  });

  if (!response.ok) {
    throw new Error(`Razorpay refund error: ${response.status}`);
  }

  const data = await response.json();

  return {
    refundId: data.id,
    status: data.status
  };
}

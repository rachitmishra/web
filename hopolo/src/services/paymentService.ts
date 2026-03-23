export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
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

export const refundOrder = async (paymentId: string, amount: number) => {
  const keyId = process.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.VITE_RAZORPAY_KEY_SECRET || import.meta.env.VITE_RAZORPAY_KEY_SECRET;

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
};

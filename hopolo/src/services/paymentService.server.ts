export async function refundOrder(paymentId: string, amount: number) {
  const keyId = process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.VITE_RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.warn("Razorpay credentials missing. Using mock refund.");
    return {
      refundId: `MOCK-REFUND-${paymentId}`,
      status: 'processed'
    };
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

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

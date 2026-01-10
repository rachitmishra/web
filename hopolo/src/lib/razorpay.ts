import Razorpay from 'razorpay';

export const validateWebhookSignature = (body: string, signature: string, secret: string): boolean => {
  return Razorpay.validateWebhookSignature(body, signature, secret);
};

import { describe, it, expect, vi } from 'vitest';
import { validateWebhookSignature } from './razorpay';
import Razorpay from 'razorpay';

vi.mock('razorpay');

describe('Razorpay Webhook Verification', () => {
  it('should return true for a valid signature', () => {
    const body = JSON.stringify({ event: 'payment.captured' });
    const signature = 'valid_signature';
    const secret = 'webhook_secret';

    (Razorpay.validateWebhookSignature as any).mockReturnValue(true);

    const isValid = validateWebhookSignature(body, signature, secret);
    expect(isValid).toBe(true);
    expect(Razorpay.validateWebhookSignature).toHaveBeenCalledWith(body, signature, secret);
  });

  it('should return false for an invalid signature', () => {
    (Razorpay.validateWebhookSignature as any).mockReturnValue(false);
    const isValid = validateWebhookSignature('{}', 'invalid', 'secret');
    expect(isValid).toBe(false);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { refundOrder } from './paymentService';

describe('paymentService - admin extensions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_RAZORPAY_KEY_ID', 'test_id');
    vi.stubEnv('VITE_RAZORPAY_KEY_SECRET', 'test_secret');
  });

  it('refundOrder should call Razorpay API and return refund details', async () => {
    const mockPaymentId = 'pay_123';
    const mockAmount = 1000; // in paise

    const mockResponse = {
      id: 'rfnd_123',
      payment_id: mockPaymentId,
      amount: mockAmount,
      status: 'processed'
    };

    const fetchSpy = vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    }));

    const result = await refundOrder(mockPaymentId, mockAmount);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.razorpay.com/v1/payments/${mockPaymentId}/refund`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Basic'),
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ amount: mockAmount })
      })
    );
    expect(result).toEqual({
      refundId: 'rfnd_123',
      status: 'processed'
    });
  });

  it('refundOrder should throw error if API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: { description: 'Payment already refunded' } })
    }));

    await expect(refundOrder('pay_123', 100)).rejects.toThrow('Razorpay refund error: 400');
  });
});

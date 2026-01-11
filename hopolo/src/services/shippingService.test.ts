import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createShippingOrder } from './shippingService';

describe('shippingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_SHADOWFAX_API_KEY', 'test-key');
    vi.stubEnv('VITE_SHADOWFAX_API_URL', 'https://api.shadowfax.in');
  });

  it('createShippingOrder should call Shadowfax API and return tracking ID', async () => {
    const mockOrder = {
      orderId: 'o123',
      customerName: 'John Doe',
      phone: '1234567890',
      address: '123 Street, City',
      items: [{ name: 'Product 1', qty: 1, price: 100 }]
    };

    const mockResponse = {
      status: 'success',
      data: {
        waybill_number: 'SFX123456',
        label_url: 'https://shadowfax.in/labels/SFX123456.pdf'
      }
    };

    const fetchSpy = vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    }));

    const result = await createShippingOrder(mockOrder);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.shadowfax.in'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Token test-key',
          'Content-Type': 'application/json'
        }),
        body: expect.stringContaining('o123')
      })
    );
    expect(result).toEqual({
      trackingId: 'SFX123456',
      labelUrl: 'https://shadowfax.in/labels/SFX123456.pdf'
    });
  });

  it('createShippingOrder should throw error if API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Invalid address' })
    }));

    const mockOrder = {
      orderId: 'o123',
      customerName: 'John Doe',
      phone: '1234567890',
      address: '123 Street, City',
      items: []
    };

    await expect(createShippingOrder(mockOrder)).rejects.toThrow('Shadowfax API error: 400');
  });
});

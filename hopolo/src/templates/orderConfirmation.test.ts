import { describe, it, expect } from 'vitest';
import { generateOrderConfirmationHtml } from './orderConfirmation';

describe('orderConfirmation Template', () => {
  it('should generate valid HTML with order details', () => {
    const mockOrder = {
      id: 'o123',
      items: [
        { name: 'Product A', quantity: 2, price: 100 },
        { name: 'Product B', quantity: 1, price: 50 },
      ],
      total: 250,
      address: {
        street: '123 Test St',
        city: 'Demo City',
        zip: '12345'
      }
    };

    const html = generateOrderConfirmationHtml(mockOrder);

    expect(html).toContain('Order Confirmed');
    expect(html).toContain('o123');
    expect(html).toContain('Product A');
    expect(html).toContain('x 2');
    expect(html).toContain('Product B');
    expect(html).toContain('₹250');
    expect(html).toContain('123 Test St');
    expect(html).toContain('Demo City');
  });
});

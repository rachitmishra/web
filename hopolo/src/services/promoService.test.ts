import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validatePromoCode } from './promoService';
import { getDocs, query, where } from 'firebase/firestore';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(() => ({ id: 'promo_codes' })),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
  };
});

vi.mock('../lib/firebase', () => ({
  db: {},
}));

describe('promoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validatePromoCode should return percentage discount', async () => {
    const mockCode = {
      code: 'PERCENT10',
      type: 'percentage',
      value: 10,
      minPurchase: 100
    };

    (getDocs as any).mockResolvedValue({
      empty: false,
      docs: [{ data: () => mockCode }]
    });

    const result = await validatePromoCode('PERCENT10', 150);

    expect(result).toEqual({
      discount: 15,
      type: 'percentage',
      value: 10
    });
  });

  it('validatePromoCode should return fixed discount', async () => {
    const mockCode = {
      code: 'FIXED50',
      type: 'fixed',
      value: 50,
      minPurchase: 200
    };

    (getDocs as any).mockResolvedValue({
      empty: false,
      docs: [{ data: () => mockCode }]
    });

    const result = await validatePromoCode('FIXED50', 250);

    expect(result).toEqual({
      discount: 50,
      type: 'fixed',
      value: 50
    });
  });

  it('validatePromoCode should throw error if minPurchase not met', async () => {
    const mockCode = {
      code: 'BIGDISCOUNT',
      type: 'percentage',
      value: 50,
      minPurchase: 1000
    };

    (getDocs as any).mockResolvedValue({
      empty: false,
      docs: [{ data: () => mockCode }]
    });

    await expect(validatePromoCode('BIGDISCOUNT', 500)).rejects.toThrow('Minimum purchase of $1000 required');
  });

  it('validatePromoCode should throw error if code not found', async () => {
    (getDocs as any).mockResolvedValue({ empty: true });

    await expect(validatePromoCode('INVALID', 100)).rejects.toThrow('Invalid promo code');
  });
});

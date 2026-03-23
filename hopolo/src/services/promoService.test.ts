import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validatePromoCode } from './promoService';
import { getDocs, collection, query, where } from 'firebase/firestore';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn().mockReturnValue('mock-collection'),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn().mockReturnValue('mock-where'),
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
    const mockPromoDoc = {
      data: () => ({
        code: 'PERCENT10',
        type: 'percentage',
        value: 10,
      })
    };

    (getDocs as any).mockResolvedValue({
      empty: false,
      docs: [mockPromoDoc]
    });

    const result = await validatePromoCode('PERCENT10', 150);

    expect(result).toEqual({
      code: 'PERCENT10',
      discount: 15
    });

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'promos');
    expect(where).toHaveBeenCalledWith('code', '==', 'PERCENT10');
  });

  it('validatePromoCode should return fixed discount', async () => {
    const mockPromoDoc = {
      data: () => ({
        code: 'FIXED50',
        type: 'fixed',
        value: 50,
      })
    };

    (getDocs as any).mockResolvedValue({
      empty: false,
      docs: [mockPromoDoc]
    });

    const result = await validatePromoCode('FIXED50', 250);

    expect(result).toEqual({
      code: 'FIXED50',
      discount: 50
    });
  });

  it('validatePromoCode should throw error if minPurchase not met', async () => {
    const mockPromoDoc = {
      data: () => ({
        code: 'BIGDISCOUNT',
        type: 'fixed',
        value: 100,
        minPurchase: 1000
      })
    };

    (getDocs as any).mockResolvedValue({
      empty: false,
      docs: [mockPromoDoc]
    });

    await expect(validatePromoCode('BIGDISCOUNT', 500)).rejects.toThrow('Minimum purchase amount of $1000 required');
  });

  it('validatePromoCode should throw error if code not found', async () => {
    (getDocs as any).mockResolvedValue({ empty: true });

    await expect(validatePromoCode('INVALID', 100)).rejects.toThrow('Invalid promo code');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOrder } from './orderService';
import { addDoc } from 'firebase/firestore';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(() => ({ id: 'mock-collection' })),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
  };
});

vi.mock('../lib/firebase', () => ({
  db: {},
}));

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createOrder should call addDoc with order details', async () => {
    const mockOrder = {
      userId: 'user123',
      items: [{ productId: 'p1', quantity: 1 }],
      total: 100,
      paymentId: 'pay_123',
      status: 'paid',
      address: { street: '123' },
      createdAt: expect.anything(),
    };

    (addDoc as any).mockResolvedValue({ id: 'order_123' });

    const result = await createOrder(mockOrder);

    expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      userId: 'user123',
      paymentId: 'pay_123',
      status: 'paid'
    }));
    expect(result).toBe('order_123');
  });

  it('fetchAllOrders should return mapped orders', async () => {
    const { getDocs } = await import('firebase/firestore');
    const mockDocs = [
      { id: 'o1', data: () => ({ total: 100 }) },
      { id: 'o2', data: () => ({ total: 200 }) },
    ];
    (getDocs as any).mockResolvedValue({ docs: mockDocs });

    const { fetchAllOrders } = await import('./orderService');
    const result = await fetchAllOrders();

    expect(getDocs).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: 'o1', total: 100 });
  });
});

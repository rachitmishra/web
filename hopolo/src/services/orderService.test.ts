import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOrder } from './orderService';
import { addDoc } from 'firebase/firestore';
import { sendEmail } from './emailService';

vi.mock('./emailService');
vi.mock('../templates/orderConfirmation', () => ({
  generateOrderConfirmationHtml: vi.fn().mockReturnValue('<html>Confirmation HTML</html>'),
}));
vi.mock('../templates/deliveryFeedback', () => ({
  generateDeliveryFeedbackHtml: vi.fn().mockReturnValue('<html>Feedback HTML</html>'),
}));

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(() => ({ id: 'mock-collection' })),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    getDoc: vi.fn(),
    doc: vi.fn(),
    updateDoc: vi.fn(),
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

  it('createOrder should call addDoc with order details and send confirmation email', async () => {
    const mockOrder = {
      userId: 'user123',
      items: [{ productId: 'p1', name: 'P1', price: 100, quantity: 1 }],
      total: 100,
      paymentId: 'pay_123',
      status: 'paid',
      address: { street: '123' },
      userEmail: 'test@example.com', // New field
    };

    (addDoc as any).mockResolvedValue({ id: 'order_123' });

    const result = await createOrder(mockOrder);

    expect(addDoc).toHaveBeenCalled();
    expect(result).toBe('order_123');
    
    expect(sendEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Order Confirmed - Hopolo',
      html: '<html>Confirmation HTML</html>',
    });
  });

  it('updateOrderStatus should update firestore and send feedback email if delivered', async () => {
    const { getDoc, updateDoc } = await import('firebase/firestore');
    const { updateOrderStatus } = await import('./orderService');
    
    (getDoc as any).mockResolvedValue({
      exists: () => true,
      id: 'o123',
      data: () => ({ userEmail: 'customer@example.com' })
    });
    (updateDoc as any).mockResolvedValue(undefined);

    await updateOrderStatus('o123', 'delivered');

    expect(updateDoc).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledWith({
      to: 'customer@example.com',
      subject: 'Your order has arrived! 📦',
      html: '<html>Feedback HTML</html>',
    });
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

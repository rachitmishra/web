import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addToCart, subscribeToCart } from './cartService';
import { setDoc, onSnapshot, getDoc, doc } from 'firebase/firestore';

// Mock firebase/firestore
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    doc: vi.fn(() => ({ id: 'mock-doc-id' })), // Mock doc to return something
    setDoc: vi.fn(),
    getDoc: vi.fn(),
    onSnapshot: vi.fn(),
  };
});

// Mock lib/firebase
vi.mock('../lib/firebase', () => ({
  db: {},
}));

// Mock lib/session
vi.mock('../lib/session', () => ({
  getSessionId: () => 'test-session-id',
}));

describe('cartService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('addToCart should call setDoc with the new product', async () => {
    const mockProduct = { id: 'p1', name: 'Product 1', price: 10, category: 'test' };
    
    // Mock getDoc to return empty cart initially
    (getDoc as any).mockResolvedValue({
      exists: () => false,
    });

    await addToCart(mockProduct, 2);

    expect(doc).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), {
      items: [{ product: mockProduct, quantity: 2 }]
    });
  });

  it('subscribeToCart should call onSnapshot and trigger callback', () => {
    const callback = vi.fn();
    const mockUnsubscribe = vi.fn();
    (onSnapshot as any).mockReturnValue(mockUnsubscribe);

    const unsubscribe = subscribeToCart(callback);

    expect(onSnapshot).toHaveBeenCalled();
    expect(unsubscribe).toBe(mockUnsubscribe);
    
    // Simulate snapshot update
    const mockItems = [{ product: { id: 'p1' }, quantity: 1 }];
    const snapshotCallback = (onSnapshot as any).mock.calls[0][1];
    
    // Properly mock the document snapshot
    snapshotCallback({
      exists: () => true,
      data: () => ({ items: mockItems })
    });

    expect(callback).toHaveBeenCalledWith(mockItems);
  });
});
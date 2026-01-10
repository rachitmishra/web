import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProducts } from './productService';
import { getDocs, collection } from 'firebase/firestore';

// Mock firebase/firestore
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(),
    getDocs: vi.fn(),
  };
});

// Mock the firebase app initialization in lib/firebase
vi.mock('../lib/firebase', () => ({
  db: {},
}));

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchProducts should return a list of products mapped correctly', async () => {
    const mockData = [
      { id: '1', data: () => ({ name: 'Product 1', price: 100, category: 'test' }) },
      { id: '2', data: () => ({ name: 'Product 2', price: 200, category: 'test' }) },
    ];

    (getDocs as any).mockResolvedValue({
      docs: mockData,
    });

    const products = await fetchProducts();

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'products');
    expect(getDocs).toHaveBeenCalled();
    expect(products).toHaveLength(2);
    expect(products[0]).toEqual({ id: '1', name: 'Product 1', price: 100, category: 'test' });
  });
});

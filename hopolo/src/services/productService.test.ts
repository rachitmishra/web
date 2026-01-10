import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProducts, fetchCategories } from './productService';
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

  it('fetchProducts should handle errors gracefully', async () => {
    (getDocs as any).mockRejectedValue(new Error('Firestore error'));

    await expect(fetchProducts()).rejects.toThrow('Firestore error');
  });

  it('fetchCategories should return a list of categories', async () => {
    const mockData = [
      { id: 'cat1', data: () => ({ name: 'Electronics' }) },
      { id: 'cat2', data: () => ({ name: 'Clothing' }) },
    ];

    (getDocs as any).mockResolvedValue({
      docs: mockData,
    });

    const categories = await fetchCategories();

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'categories');
    expect(categories).toHaveLength(2);
    expect(categories[0]).toEqual({ id: 'cat1', name: 'Electronics' });
  });
});

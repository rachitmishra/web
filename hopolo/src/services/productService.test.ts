import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProducts, fetchCategories, saveProduct } from './productService';
import { getDocs, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Mock firebase/firestore
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    serverTimestamp: vi.fn(),
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

  it('saveProduct should add a new product document', async () => {
    const mockProductData = {
      name: 'New Product',
      price: 150,
      category: 'New Cat',
      variants: [{ size: 'M', color: 'Green', stock: 20 }]
    };

    (addDoc as any).mockResolvedValue({ id: 'new_id' });

    const result = await saveProduct(mockProductData as any);

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'products');
    expect(addDoc).toHaveBeenCalledWith(undefined, expect.objectContaining({
      name: 'New Product',
      price: 150,
      category: 'New Cat',
      variants: [{ size: 'M', color: 'Green', stock: 20 }],
      createdAt: undefined,
      updatedAt: undefined
    }));
    expect(result).toBe('new_id');
  });

  it('fetchProducts should return a list of products mapped correctly', async () => {
    const mockData = [
      { 
        id: '1', 
        data: () => ({ 
          name: 'Product 1', 
          price: 100, 
          category: 'test',
          image: 'img1.jpg',
          variants: [{ id: 'v1', size: 'S', color: 'Red', stock: 10 }]
        }) 
      },
      { 
        id: '2', 
        data: () => ({ 
          name: 'Product 2', 
          price: 200, 
          category: 'test',
          // Missing images and variants
        }) 
      },
    ];

    (getDocs as any).mockResolvedValue({
      docs: mockData,
    });

    const products = await fetchProducts();

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'products');
    expect(getDocs).toHaveBeenCalled();
    expect(products).toHaveLength(2);
    
    expect(products[0]).toEqual(expect.objectContaining({
      id: '1', 
      name: 'Product 1', 
      price: 100, 
      category: 'test',
      images: ['img1.jpg'],
      variants: [{ id: 'v1', size: 'S', color: 'Red', stock: 10 }]
    }));

    expect(products[1]).toEqual(expect.objectContaining({
      id: '2',
      name: 'Product 2',
      images: [],
      variants: []
    }));
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
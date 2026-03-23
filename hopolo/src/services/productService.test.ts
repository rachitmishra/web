import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProducts, fetchCategories, saveProduct, fetchBestSellers } from './productService';
import { getDocs, collection, addDoc, query, where } from 'firebase/firestore';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn().mockReturnValue('mock-collection'),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn().mockReturnValue('mock-where'),
  };
});

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
      variants: [{ size: 'M', color: 'Green', stock: 20 } as any]
    };

    (addDoc as any).mockResolvedValue({ id: 'new_id' });

    const result = await saveProduct(mockProductData as any);

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'products');
    expect(addDoc).toHaveBeenCalledWith('mock-collection', expect.objectContaining({
      name: 'New Product',
      price: 150,
      category: 'New Cat'
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
      image: 'img1.jpg'
    }));

    expect(products[1]).toEqual(expect.objectContaining({
      id: '2',
      name: 'Product 2'
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

  it('fetchBestSellers should return only best selling products', async () => {
    const mockData = [
      {
        id: '1',
        data: () => ({ name: 'Best Seller 1', price: 100, isBestSeller: true })
      }
    ];

    (getDocs as any).mockResolvedValue({
      docs: mockData,
    });

    // Mock query to verify it's called
    (query as any).mockReturnValue('mock-query');

    const products = await fetchBestSellers();

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'products');
    expect(where).toHaveBeenCalledWith('isBestSeller', '==', true);
    expect(query).toHaveBeenCalledWith(expect.anything(), expect.anything());
    expect(getDocs).toHaveBeenCalledWith('mock-query');
    expect(products).toHaveLength(1);
    expect(products[0].name).toBe('Best Seller 1');
  });
});

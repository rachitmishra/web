import { describe, it, expect } from 'vitest';
import { aggregateRevenuePerDay, calculateTopProducts, calculateCategoryShare } from './analyticsUtils';

const mockOrders = [
  {
    id: '1',
    createdAt: { toDate: () => new Date('2023-01-01T10:00:00') },
    total: 100,
    items: [
      { product: { id: 'p1', name: 'Product 1', category: 'Cat A' }, quantity: 2 },
      { product: { id: 'p2', name: 'Product 2', category: 'Cat B' }, quantity: 1 }
    ],
    status: 'paid'
  },
  {
    id: '2',
    createdAt: { toDate: () => new Date('2023-01-01T14:00:00') },
    total: 50,
    items: [
      { product: { id: 'p1', name: 'Product 1', category: 'Cat A' }, quantity: 1 }
    ],
    status: 'paid'
  },
  {
    id: '3',
    createdAt: { toDate: () => new Date('2023-01-02T10:00:00') },
    total: 200,
    items: [
      { product: { id: 'p3', name: 'Product 3', category: 'Cat B' }, quantity: 4 }
    ],
    status: 'paid'
  },
  {
    id: '4',
    createdAt: { toDate: () => new Date('2023-01-02T12:00:00') },
    total: 100,
    items: [],
    status: 'refunded' // Should be ignored
  }
];

describe('Analytics Utilities', () => {
  it('aggregateRevenuePerDay should group revenue by date', () => {
    const result = aggregateRevenuePerDay(mockOrders);
    // 2023-01-01: 100 + 50 = 150
    // 2023-01-02: 200 (refunded ignored)
    expect(result).toEqual([
      { date: '2023-01-01', revenue: 150 },
      { date: '2023-01-02', revenue: 200 }
    ]);
  });

  it('calculateTopProducts should rank products by quantity sold', () => {
    const result = calculateTopProducts(mockOrders);
    // Product 1: 2 + 1 = 3
    // Product 2: 1
    // Product 3: 4
    // Refunded items ignored? Usually yes.
    // Order 4 was refunded, but has no items in mock. 
    // Let's assume calculateTopProducts only counts 'paid'/'shipped'/'delivered' orders.
    
    expect(result).toEqual([
      { name: 'Product 3', quantity: 4 },
      { name: 'Product 1', quantity: 3 },
      { name: 'Product 2', quantity: 1 }
    ]);
  });

  it('calculateCategoryShare should calculate percentage share', () => {
    const result = calculateCategoryShare(mockOrders);
    // Cat A: Product 1 (3 items)
    // Cat B: Product 2 (1 item) + Product 3 (4 items) = 5 items
    // Total items: 8
    
    // Cat A: 3/8 = 37.5%
    // Cat B: 5/8 = 62.5%
    
    // Expecting result to be roughly correct or specific format
    // Let's assume it returns array of { name, value } for charts
    const catA = result.find(c => c.name === 'Cat A');
    const catB = result.find(c => c.name === 'Cat B');
    
    expect(catA?.value).toBe(3);
    expect(catB?.value).toBe(5);
  });
});

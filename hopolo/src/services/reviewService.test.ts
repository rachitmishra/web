import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addReview, fetchReviews } from './reviewService';
import { addDoc, getDocs } from 'firebase/firestore';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(() => ({ id: 'mock-collection' })),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
  };
});

vi.mock('../lib/firebase', () => ({
  db: {},
}));

describe('reviewService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('addReview should call addDoc with review data', async () => {
    const mockReview = {
      productId: 'p1',
      userId: 'u1',
      userName: 'User 1',
      rating: 3,
      comment: 'Great!',
    };

    (addDoc as any).mockResolvedValue({ id: 'r1' });

    const result = await addReview(mockReview);

    expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      productId: 'p1',
      rating: 3,
      createdAt: expect.anything()
    }));
    expect(result).toBe('r1');
  });

  it('fetchReviews should return mapped reviews', async () => {
    const mockDocs = [
      { id: 'r1', data: () => ({ productId: 'p1', rating: 3 }) },
      { id: 'r2', data: () => ({ productId: 'p1', rating: 2 }) },
    ];
    (getDocs as any).mockResolvedValue({ docs: mockDocs });

    const result = await fetchReviews('p1');

    expect(getDocs).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: 'r1', productId: 'p1', rating: 3 });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { seedProducts, seedReviews, seedUserProfile } from './seederService';
import { addDoc, setDoc, getDocs } from 'firebase/firestore';

vi.mock('firebase/firestore', () => {
  return {
    getFirestore: vi.fn(),
    collection: vi.fn(() => ({ id: 'mock-collection' })),
    addDoc: vi.fn(),
    setDoc: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(() => ({ docs: [], empty: true })),
    query: vi.fn(),
    where: vi.fn(),
    serverTimestamp: vi.fn(),
  };
});

vi.mock('../lib/firebase', () => ({
  db: {},
  auth: { currentUser: { uid: 'test-uid' } }
}));

describe('seederService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('seedProducts should add products to Firestore', async () => {
    (addDoc as any).mockResolvedValue({ id: 'prod1' });
    await seedProducts();
    expect(addDoc).toHaveBeenCalled();
  });

  it('seedReviews should add reviews to Firestore', async () => {
    (getDocs as any).mockResolvedValue({ 
      empty: false, 
      docs: [{ id: 'prod1' }] 
    });
    (addDoc as any).mockResolvedValue({ id: 'review1' });
    
    await seedReviews();
    
    expect(addDoc).toHaveBeenCalled(); 
  });

  it('seedUserProfile should update the current user profile', async () => {
    await seedUserProfile();
    expect(setDoc).toHaveBeenCalled();
  });
});
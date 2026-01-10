import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserProfile, updateUserProfile, saveAddress } from './profileService';
import { getDoc, setDoc, updateDoc } from 'firebase/firestore';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    doc: vi.fn(() => ({ id: 'mock-doc-id' })),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
  };
});

vi.mock('../lib/firebase', () => ({
  db: {},
}));

describe('profileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getUserProfile should fetch and return user data', async () => {
    const mockProfile = { displayName: 'John Doe', emoji: '👋' };
    (getDoc as any).mockResolvedValue({
      exists: () => true,
      data: () => mockProfile,
    });

    const result = await getUserProfile('user123');
    expect(getDoc).toHaveBeenCalled();
    expect(result).toEqual({ uid: 'user123', ...mockProfile });
  });

  it('updateUserProfile should call updateDoc', async () => {
    const updates = { displayName: 'Jane Doe' };
    await updateUserProfile('user123', updates);
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), updates);
  });

  it('saveAddress should update the addresses array', async () => {
    const newAddress = { street: '123 Main St', city: 'City' };
    
    // Mock getDoc to return existing addresses
    (getDoc as any).mockResolvedValue({
      exists: () => true,
      data: () => ({ addresses: [] }),
    });

    await saveAddress('user123', newAddress);
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      addresses: [newAddress]
    });
  });
});

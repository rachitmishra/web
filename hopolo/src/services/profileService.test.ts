import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserProfile, updateUserProfile, saveAddress } from './profileService';
import { getDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    doc: vi.fn().mockReturnValue({ id: 'mock-doc-id' }),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
    arrayUnion: vi.fn((val) => ({ _methodName: 'arrayUnion', _elements: [val] })),
  };
});

vi.mock('../lib/firebase', () => ({
  db: {},
}));

describe('profileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProfile = {
    displayName: 'John Doe',
    addresses: [],
  };

  it('getUserProfile should fetch and return user data', async () => {
    (getDoc as any).mockResolvedValue({
      exists: () => true,
      data: () => mockProfile
    });

    const result = await getUserProfile('user123');
    expect(getDoc).toHaveBeenCalled();
    expect(result).toEqual({ uid: 'user123', ...mockProfile });
  });

  it('getUserProfile should return null if not found', async () => {
    (getDoc as any).mockResolvedValue({
      exists: () => false,
    });

    const result = await getUserProfile('user123');
    expect(result).toBeNull();
  });

  it('updateUserProfile should call updateDoc', async () => {
    const updates = { displayName: 'Jane Doe' };
    await updateUserProfile('user123', updates);
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), updates);
  });

  it('saveAddress should update the addresses array', async () => {
    const newAddress = { street: '123 Main St', city: 'City' };

    await saveAddress('user123', newAddress);
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      addresses: { _methodName: 'arrayUnion', _elements: [newAddress] }
    });
  });
});

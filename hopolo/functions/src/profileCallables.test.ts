import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as admin from 'firebase-admin';
import { getSecureProfileHandler, updateSecureProfileHandler } from './index';
import { encrypt } from './encryption';

vi.mock('firebase-functions', () => {
  return {
    auth: {
      user: () => ({
        onCreate: vi.fn()
      })
    }
  };
});

vi.mock('firebase-admin', () => {
  const mockGet = vi.fn();
  const mockUpdate = vi.fn();
  const mockDoc = vi.fn().mockReturnValue({ get: mockGet, update: mockUpdate });
  const mockCollection = vi.fn().mockReturnValue({ doc: mockDoc });
  const mockDb = { collection: mockCollection };
  return {
    apps: { length: 1 },
    initializeApp: vi.fn(),
    firestore: Object.assign(() => mockDb, {
      FieldValue: {
        serverTimestamp: vi.fn().mockReturnValue('mock-timestamp')
      }
    }),
    default: {
      apps: { length: 1 },
      initializeApp: vi.fn(),
      firestore: Object.assign(() => mockDb, {
        FieldValue: {
          serverTimestamp: vi.fn().mockReturnValue('mock-timestamp')
        }
      })
    }
  };
});

vi.mock('firebase-functions/v2/https', () => ({
  onCall: vi.fn((handler) => handler)
}));

// We need to mock the config to provide a key for the test
vi.mock('./config', () => ({
  getConfig: () => ({ encryptionKey: 'test_secret_key_32_chars_exactly_!!' })
}));

describe('Profile Callables', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getSecureProfile should return decrypted data', async () => {
    const db = admin.firestore();
    const key = 'test_secret_key_32_chars_exactly_!!';
    const mockProfileData = {
      uid: 'user123',
      role: 'user',
      displayName: encrypt('Sensitive Name', key), 
      addresses: encrypt(JSON.stringify([{ street: '123 Test St' }]), key) 
    };

    (db.collection('profiles').doc('user123').get as any).mockResolvedValue({
      exists: true,
      data: () => mockProfileData
    });

    const context = { auth: { uid: 'user123' } };
    const result = await getSecureProfileHandler({ data: {}, auth: context.auth } as any);

    expect(result).toBeDefined();
    expect(result.displayName).toBe('Sensitive Name');
    expect(result.addresses[0].street).toBe('123 Test St');
  });

  it('updateSecureProfile should store encrypted data', async () => {
    const db = admin.firestore();
    const context = { auth: { uid: 'user123' } };
    const data = { displayName: 'New Name', addresses: [{ street: '123 St' }] };

    await updateSecureProfileHandler({ data, auth: context.auth } as any);

    expect(db.collection('profiles').doc('user123').update).toHaveBeenCalledWith(expect.objectContaining({
      displayName: expect.not.stringContaining('New Name'),
      addresses: expect.not.stringContaining('123 St'),
      updatedAt: expect.anything()
    }));
  });
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as admin from 'firebase-admin';
import { onUserCreated } from './index';

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
  const mockSet = vi.fn().mockResolvedValue({});
  const mockDoc = vi.fn().mockReturnValue({ set: mockSet });
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

describe('User Profile Trigger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a profile document when a new user is created', async () => {
    const mockUser = {
      uid: 'user123',
      email: 'test@example.com',
      displayName: 'Test User'
    };

    // We call the function directly for the test
    // In a real environment, Cloud Functions handles the event wrap
    await onUserCreated(mockUser as any);

    const db = admin.firestore();
    expect(db.collection).toHaveBeenCalledWith('profiles');
    expect(db.collection('profiles').doc).toHaveBeenCalledWith('user123');
    expect(db.collection('profiles').doc('user123').set).toHaveBeenCalledWith({
      uid: 'user123',
      email: 'test@example.com',
      role: 'user',
      addresses: [],
      displayName: '',
      emoji: '',
      createdAt: expect.anything()
    });
  });
});

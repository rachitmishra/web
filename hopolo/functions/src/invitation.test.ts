import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as admin from 'firebase-admin';
import { createInviteHandler } from './index';

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
  const mockAdd = vi.fn().mockResolvedValue({ id: 'invite123' });
  const mockGet = vi.fn();
  const mockDoc = vi.fn().mockReturnValue({ get: mockGet });
  const mockCollection = vi.fn().mockReturnValue({ add: mockAdd, doc: mockDoc });
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

describe('Invitation Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createInvite should restrict to admin role', async () => {
    const db = admin.firestore();
    // User is NOT an admin
    (db.collection('profiles').doc('user123').get as any).mockResolvedValue({
      exists: true,
      data: () => ({ role: 'user' })
    });

    const context = { auth: { uid: 'user123' } };
    const data = { phoneNumber: '+1234567890', role: 'editor' };

    await expect(createInviteHandler({ data, auth: context.auth } as any)).rejects.toThrow('Only admins can create invitations.');
  });

  it('createInvite should generate a token for valid admin', async () => {
    const db = admin.firestore();
    // User IS an admin
    (db.collection('profiles').doc('admin123').get as any).mockResolvedValue({
      exists: true,
      data: () => ({ role: 'admin' })
    });

    const context = { auth: { uid: 'admin123' } };
    const data = { phoneNumber: '+1234567890', role: 'editor' };

    const result = await createInviteHandler({ data, auth: context.auth } as any);

    expect(result).toBeDefined();
    expect(result.inviteCode).toBeDefined();
    expect(db.collection).toHaveBeenCalledWith('invitations');
    expect(db.collection('invitations').add).toHaveBeenCalledWith(expect.objectContaining({
      phoneNumber: '+1234567890',
      role: 'editor',
      status: 'pending'
    }));
  });
});

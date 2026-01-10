import { describe, it, expect, vi } from 'vitest';
import * as firebase from './firebase';

// Mock firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => 'mockAuth'),
}));

describe('firebase setup', () => {
  it('should export db', () => {
    expect(firebase.db).toBeDefined();
  });

  it('should export auth', () => {
    expect(firebase.auth).toBeDefined();
    expect(firebase.auth).toBe('mockAuth');
  });
});
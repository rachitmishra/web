import '@testing-library/jest-dom'
import { vi } from 'vitest';

const mockStorage: Record<string, string> = {};

vi.stubGlobal('localStorage', {
  getItem: vi.fn((key: string) => mockStorage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockStorage[key] = value;
  }),
  clear: vi.fn(() => {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  }),
  removeItem: vi.fn((key: string) => {
    delete mockStorage[key];
  }),
  key: vi.fn((index: number) => Object.keys(mockStorage)[index] || null),
  length: 0,
});

// Update length property
Object.defineProperty(localStorage, 'length', {
  get: () => Object.keys(mockStorage).length,
});

// Mock Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(),
    doc: vi.fn(),
    onSnapshot: vi.fn(() => vi.fn()),
  };
});

vi.mock('firebase/auth', () => {
  const mockAuth = { currentUser: null };
  return {
    getAuth: vi.fn(() => mockAuth),
    onAuthStateChanged: vi.fn((authObj, cb) => {
      cb(authObj?.currentUser || null);
      return vi.fn();
    }),
    signInWithPhoneNumber: vi.fn(),
    RecaptchaVerifier: vi.fn(),
    signOut: vi.fn(),
  };
});

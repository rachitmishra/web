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
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    orderBy: vi.fn(),
    onSnapshot: vi.fn(() => vi.fn()),
  };
});

vi.mock('firebase/auth', () => {
  const mockAuth = { currentUser: null };
  return {
    getAuth: vi.fn(() => mockAuth),
    onAuthStateChanged: vi.fn((authObj, cb) => {
      // In Firebase, onAuthStateChanged callback is called asynchronously after initialization
      // But for tests, calling it immediately or in a timeout is common.
      cb(authObj?.currentUser || null);
      return vi.fn();
    }),
    signInWithPhoneNumber: vi.fn(),
    RecaptchaVerifier: vi.fn(),
  };
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStorefrontSettings, updateStorefrontSettings, subscribeToStorefrontSettings } from './storefrontService';
import { getDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';

// Mock firebase/firestore
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    doc: vi.fn().mockReturnValue('mock-doc-ref'),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    onSnapshot: vi.fn(),
  };
});

// Mock the firebase app initialization in lib/firebase
vi.mock('../lib/firebase', () => ({
  db: { type: 'db' }, // Give it some value so it's not undefined
}));

describe('storefrontService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getStorefrontSettings should return data if document exists', async () => {
    const mockSettings = {
      bannerText: 'Welcome!',
      bannerColor: '#000000',
      bannerLink: '/',
      bannerVisible: true,
      isMaintenanceMode: false,
    };

    (getDoc as any).mockResolvedValue({
      exists: () => true,
      data: () => mockSettings,
    });

    const settings = await getStorefrontSettings();

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'settings', 'storefront');
    expect(getDoc).toHaveBeenCalledWith('mock-doc-ref');
    expect(settings).toEqual(expect.objectContaining(mockSettings));
  });

  it('getStorefrontSettings should return default settings if document does not exist', async () => {
    (getDoc as any).mockResolvedValue({
      exists: () => false,
    });

    const settings = await getStorefrontSettings();
    expect(settings).not.toBeNull();
    expect(settings?.heroTitle).toBe('Hopolo Boutique');
    expect(settings?.bannerVisible).toBe(false);
    expect(settings?.reviews).toHaveLength(3);
  });

  it('updateStorefrontSettings should call setDoc with correct data', async () => {
    const newSettings = {
      bannerText: 'Updated!',
      bannerColor: '#ffffff',
      bannerVisible: false,
    };

    (setDoc as any).mockResolvedValue(undefined);

    await updateStorefrontSettings(newSettings as any);

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'settings', 'storefront');
    expect(setDoc).toHaveBeenCalledWith('mock-doc-ref', expect.objectContaining(newSettings), { merge: true });
  });

  it('subscribeToStorefrontSettings should call onSnapshot and callback', async () => {
    const mockSettings = { bannerText: 'Live Update' };
    const callback = vi.fn();

    (onSnapshot as any).mockImplementation((ref: any, cb: any) => {
      cb({
        exists: () => true,
        data: () => mockSettings,
      });
      return () => {}; // Unsubscribe
    });

    subscribeToStorefrontSettings(callback);

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'settings', 'storefront');
    expect(onSnapshot).toHaveBeenCalledWith('mock-doc-ref', expect.any(Function), expect.any(Function));
    expect(callback).toHaveBeenCalledWith(expect.objectContaining(mockSettings));
  });
});
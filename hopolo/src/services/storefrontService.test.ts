import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStorefrontSettings, updateStorefrontSettings } from './storefrontService';
import { getDoc, doc, setDoc } from 'firebase/firestore';

// Mock firebase/firestore
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    doc: vi.fn().mockReturnValue('mock-doc-ref'),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
  };
});

// Mock the firebase app initialization in lib/firebase
vi.mock('../lib/firebase', () => ({
  db: {},
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
    expect(settings).toEqual(mockSettings);
  });

  it('getStorefrontSettings should return null if document does not exist', async () => {
    (getDoc as any).mockResolvedValue({
      exists: () => false,
    });

    const settings = await getStorefrontSettings();
    expect(settings).toBeNull();
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
});

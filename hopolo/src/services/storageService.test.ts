import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadProductImages } from './storageService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

vi.mock('firebase/storage', async () => {
  const actual = await vi.importActual('firebase/storage');
  return {
    ...actual,
    getStorage: vi.fn(),
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
  };
});

vi.mock('../lib/firebase', () => ({
  storage: {},
}));

describe('storageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploadProductImages should upload files and return URLs', async () => {
    const mockFile = new File(['content'], 'test.png', { type: 'image/png' });
    const mockRef = {};
    const mockSnapshot = {};
    const mockUrl = 'https://example.com/test.png';

    (ref as any).mockReturnValue(mockRef);
    (uploadBytes as any).mockResolvedValue(mockSnapshot);
    (getDownloadURL as any).mockResolvedValue(mockUrl);

    const urls = await uploadProductImages([mockFile]);

    expect(ref).toHaveBeenCalledWith(expect.anything(), 'products/mock-uuid_test.png');
    expect(uploadBytes).toHaveBeenCalledWith(mockRef, mockFile);
    expect(getDownloadURL).toHaveBeenCalledWith(mockRef);
    expect(urls).toEqual([mockUrl]);
  });

  it('uploadProductImages should handle empty input', async () => {
    const urls = await uploadProductImages([]);
    expect(urls).toEqual([]);
  });
});

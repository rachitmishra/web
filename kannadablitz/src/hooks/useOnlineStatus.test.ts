import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useOnlineStatus } from './useOnlineStatus';

describe('useOnlineStatus', () => {
  it('returns true when online', () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  it('should return false when offline', () => {
    vi.stubGlobal('navigator', {
      ...window.navigator,
      onLine: false,
    });
    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(false);
  });

  it('should update status when online/offline events fire', () => {
    const { result } = renderHook(() => useOnlineStatus());
    
    act(() => {
      vi.stubGlobal('navigator', {
        ...window.navigator,
        onLine: false,
      });
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.stubGlobal('navigator', {
        ...window.navigator,
        onLine: true,
      });
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current).toBe(true);
  });
});

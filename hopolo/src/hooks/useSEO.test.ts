import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSEO } from './useSEO';

describe('useSEO Hook', () => {
  beforeEach(() => {
    // Clear document head
    document.title = '';
    const metas = document.getElementsByTagName('meta');
    for (let i = metas.length - 1; i >= 0; i--) {
      metas[i].parentNode?.removeChild(metas[i]);
    }
  });

  it('should update document title', () => {
    renderHook(() => useSEO({ title: 'New Title' }));
    expect(document.title).toBe('New Title | Hopolo');
  });

  it('should set description meta tag', () => {
    renderHook(() => useSEO({ title: 'Title', description: 'Sample description' }));
    
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')).toBe('Sample description');
  });

  it('should set open graph tags', () => {
    renderHook(() => useSEO({ 
      title: 'OG Title', 
      ogType: 'product',
      image: 'https://example.com/img.jpg' 
    }));
    
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('OG Title | Hopolo');
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('product');
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe('https://example.com/img.jpg');
  });
});

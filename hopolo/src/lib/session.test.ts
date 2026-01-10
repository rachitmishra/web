import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSessionId } from './session';

describe('session utility', () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      clear: vi.fn(() => {
        Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
      }),
    });
  });

  it('should generate a new session ID if none exists in localStorage', () => {
    const sessionId = getSessionId();
    expect(sessionId).toBeDefined();
    expect(typeof sessionId).toBe('string');
    expect(sessionId.length).toBeGreaterThan(0);
    expect(localStorage.setItem).toHaveBeenCalledWith('hopolo_session_id', sessionId);
  });

  it('should return the existing session ID if it exists in localStorage', () => {
    const existingId = 'existing-uuid-123';
    mockStorage['hopolo_session_id'] = existingId;
    
    const sessionId = getSessionId();
    expect(sessionId).toBe(existingId);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('should persist the same session ID across multiple calls', () => {
    const firstId = getSessionId();
    const secondId = getSessionId();
    expect(firstId).toBe(secondId);
  });
});
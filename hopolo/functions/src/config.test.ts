import { describe, it, expect } from 'vitest';
import { getConfig } from './config';

describe('Function Config', () => {
  it('should have an ENCRYPTION_KEY defined', () => {
    const config = getConfig();
    expect(config.encryptionKey).toBeDefined();
    expect(config.encryptionKey.length).toBeGreaterThan(0);
  });
});

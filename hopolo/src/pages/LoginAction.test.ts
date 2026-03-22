import { describe, it, expect, vi, beforeEach } from 'vitest';
import { action } from './Login';
import * as authServer from '../lib/auth.server';
import * as profileService from '../services/profileService.server';

vi.mock('../lib/auth.server');
vi.mock('../services/profileService.server');

describe('Login Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return success: true and role: admin for admin user', async () => {
    const formData = new FormData();
    formData.append('idToken', 'valid-token');
    formData.append('uid', 'admin-uid');

    const request = new Request('http://localhost/login', {
      method: 'POST',
      body: formData,
    });

    vi.mocked(authServer.createSessionCookie).mockResolvedValue({
      cookie: 'hopolo_session=session-cookie; Path=/;',
      expires: 1000,
    });

    vi.mocked(profileService.getSecureProfile).mockResolvedValue({
      uid: 'admin-uid',
      email: 'admin@example.com',
      role: 'admin',
      displayName: 'Admin',
      emoji: '👤',
      addresses: [],
    });

    const response = await action({ request });
    expect(response).toBeInstanceOf(Response);
    
    const data = await response.json();
    expect(data).toEqual({ success: true, role: 'admin' });
    expect(response.headers.get('Set-Cookie')).toBe('hopolo_session=session-cookie; Path=/;');
  });

  it('should return error if idToken is missing', async () => {
    const formData = new FormData();
    const request = new Request('http://localhost/login', {
      method: 'POST',
      body: formData,
    });

    const response = await action({ request });
    expect(response).toBeInstanceOf(Response);
    const data = await (response as Response).json();
    expect(data).toEqual({ success: false, error: 'Missing required authentication data' });
  });
});

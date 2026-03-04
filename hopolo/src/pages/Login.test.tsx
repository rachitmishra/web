import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import * as authService from '../services/authService';

vi.mock('../services/authService');

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set session cookie after successful OTP verification', async () => {
    const mockUser = {
      getIdToken: vi.fn().mockResolvedValue('mock-id-token'),
    };
    const mockConfirmationResult = {
      confirm: vi.fn().mockResolvedValue({ user: mockUser }),
    };
    (authService.signInWithPhone as any).mockResolvedValue(mockConfirmationResult);
    (authService.verifyOtp as any).mockResolvedValue({ user: mockUser });

    // Mock document.cookie
    let cookieStore = '';
    Object.defineProperty(document, 'cookie', {
      set: (val) => {
        cookieStore = val;
      },
      get: () => cookieStore,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Enter phone
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /send code/i }));

    // Wait for OTP step
    await waitFor(() => expect(screen.getByPlaceholderText(/enter verification code/i)).toBeInTheDocument());

    // Enter OTP
    fireEvent.change(screen.getByPlaceholderText(/enter verification code/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(authService.verifyOtp).toHaveBeenCalled();
      expect(document.cookie).toContain('session=mock-id-token');
    });
  });
});

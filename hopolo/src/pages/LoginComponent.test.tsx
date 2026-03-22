import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import * as authService from '../services/authService';

vi.mock('../services/authService');

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockSubmit = vi.fn();
const mockActionData = { success: null as any, role: null as any, error: null as any };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSubmit: () => mockSubmit,
    useActionData: () => mockActionData,
    useLocation: () => ({ search: '', state: {} }),
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockActionData.success = null;
    mockActionData.role = null;
    mockActionData.error = null;
  });

  it('should handle phone submission successfully', async () => {
    vi.mocked(authService.signInWithPhone).mockResolvedValue({} as any);
    
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const phoneInput = screen.getByPlaceholderText(/mobile number/i);
    fireEvent.change(phoneInput, { target: { value: '9999999999' } });
    fireEvent.click(screen.getByRole('button', { name: /send code/i }));

    await waitFor(() => {
      expect(authService.signInWithPhone).toHaveBeenCalled();
      expect(screen.getByText(/security check/i)).toBeInTheDocument();
    });
  });

  it('should handle phone submission error', async () => {
    vi.mocked(authService.signInWithPhone).mockRejectedValue(new Error('Failed to send'));
    
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const phoneInput = screen.getByPlaceholderText(/mobile number/i);
    fireEvent.change(phoneInput, { target: { value: '9999999999' } });
    fireEvent.click(screen.getByRole('button', { name: /send code/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
    });
  });

  it('should handle OTP verification and call submit', async () => {
    vi.mocked(authService.signInWithPhone).mockResolvedValue({} as any);
    vi.mocked(authService.verifyOtp).mockResolvedValue({ user: { uid: 'u1', getIdToken: () => Promise.resolve('t1') } } as any);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // 1. Phone step
    fireEvent.change(screen.getByPlaceholderText(/mobile number/i), { target: { value: '9999999999' } });
    fireEvent.click(screen.getByRole('button', { name: /send code/i }));

    // 2. OTP step
    const otpInput = await screen.findByPlaceholderText(/verification code/i);
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(authService.verifyOtp).toHaveBeenCalled();
      expect(mockSubmit).toHaveBeenCalledWith(
        { idToken: 't1', uid: 'u1' },
        { method: 'post' }
      );
    });
  });

  it('should redirect based on actionData success', async () => {
    mockActionData.success = true;
    mockActionData.role = 'admin';

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });

  it('should display error from actionData', async () => {
    mockActionData.success = false;
    mockActionData.error = 'Action failed';

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/action failed/i)).toBeInTheDocument();
    });
  });
});

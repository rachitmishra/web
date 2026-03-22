import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginDialog from './LoginDialog';
import * as authService from '../../../services/authService';

vi.mock('../../../services/authService');

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockFetcher = {
  submit: vi.fn(),
  data: null as any,
  state: 'idle',
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useFetcher: () => mockFetcher,
  };
});

describe('LoginDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetcher.data = null;
    mockFetcher.state = 'idle';
  });

  it('should call onClose when actionData.success is true', async () => {
    const mockOnClose = vi.fn();
    mockFetcher.data = { success: true, role: 'user' };
    
    render(
      <MemoryRouter>
        <LoginDialog isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should redirect admin to /admin when actionData.role is admin', async () => {
    const mockOnClose = vi.fn();
    mockFetcher.data = { success: true, role: 'admin' };
    
    render(
      <MemoryRouter>
        <LoginDialog isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });

  it('should redirect standard user to /profile when actionData.role is user', async () => {
    const mockOnClose = vi.fn();
    mockFetcher.data = { success: true, role: 'user' };
    
    render(
      <MemoryRouter>
        <LoginDialog isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile', { replace: true });
    });
  });

  it('should transition from phone to otp step when phone is submitted', async () => {
    vi.mocked(authService.signInWithPhone).mockResolvedValue({} as any);
    
    render(
      <MemoryRouter>
        <LoginDialog isOpen={true} onClose={() => {}} />
      </MemoryRouter>
    );

    const phoneInput = screen.getByPlaceholderText(/mobile number/i);
    fireEvent.change(phoneInput, { target: { value: '+919999999999' } });
    
    const submitBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authService.signInWithPhone).toHaveBeenCalled();
      expect(screen.getByPlaceholderText(/verification code/i)).toBeInTheDocument();
    });
  });

  it('should display error if phone submission fails', async () => {
    vi.mocked(authService.signInWithPhone).mockRejectedValue(new Error('Failed to send code'));
    
    render(
      <MemoryRouter>
        <LoginDialog isOpen={true} onClose={() => {}} />
      </MemoryRouter>
    );

    const phoneInput = screen.getByPlaceholderText(/mobile number/i);
    fireEvent.change(phoneInput, { target: { value: '+919999999999' } });
    
    const submitBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/failed to send code/i)).toBeInTheDocument();
    });
  });

  it('should display error if actionData.success is false', async () => {
    mockFetcher.data = { success: false, error: 'Invalid login' };
    
    render(
      <MemoryRouter>
        <LoginDialog isOpen={true} onClose={() => {}} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/invalid login/i)).toBeInTheDocument();
    });
  });

  it('should call fetcher.submit when OTP is verified', async () => {
    vi.mocked(authService.signInWithPhone).mockResolvedValue({} as any);
    vi.mocked(authService.verifyOtp).mockResolvedValue({ user: { uid: 'u1', getIdToken: () => Promise.resolve('t1') } } as any);
    
    render(
      <MemoryRouter>
        <LoginDialog isOpen={true} onClose={() => {}} />
      </MemoryRouter>
    );

    // 1. Phone step
    fireEvent.change(screen.getByPlaceholderText(/mobile number/i), { target: { value: '+919999999999' } });
    fireEvent.click(screen.getByRole('button', { name: /send code/i }));

    // 2. OTP step
    const otpInput = await screen.findByPlaceholderText(/verification code/i);
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(authService.verifyOtp).toHaveBeenCalled();
      expect(mockFetcher.submit).toHaveBeenCalledWith(
        { idToken: 't1', uid: 'u1' },
        { method: 'post', action: '/login' }
      );
    });
  });

  it('should display error if OTP verification fails', async () => {
    vi.mocked(authService.signInWithPhone).mockResolvedValue({} as any);
    vi.mocked(authService.verifyOtp).mockRejectedValue(new Error('Invalid code'));
    
    render(
      <MemoryRouter>
        <LoginDialog isOpen={true} onClose={() => {}} />
      </MemoryRouter>
    );

    // 1. Go to OTP step
    fireEvent.change(screen.getByPlaceholderText(/mobile number/i), { target: { value: '+919999999999' } });
    fireEvent.click(screen.getByRole('button', { name: /send code/i }));

    // 2. OTP step
    const otpInput = await screen.findByPlaceholderText(/verification code/i);
    fireEvent.change(otpInput, { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid code/i)).toBeInTheDocument();
    });
  });
});

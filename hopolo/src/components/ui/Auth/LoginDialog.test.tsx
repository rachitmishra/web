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
    
    const { rerender } = render(
      <MemoryRouter>
        <LoginDialog isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    // Simulate successful login response
    mockFetcher.data = { success: true, role: 'user' };
    
    rerender(
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
    
    const { rerender } = render(
      <MemoryRouter>
        <LoginDialog isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    // Simulate successful admin login response
    mockFetcher.data = { success: true, role: 'admin' };
    
    rerender(
      <MemoryRouter>
        <LoginDialog isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });
});

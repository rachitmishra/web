import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import * as authService from '../services/authService';

vi.mock('../services/authService');

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockSubmit = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSubmit: () => mockSubmit,
    useLocation: () => ({ search: '', state: {} }),
    useActionData: vi.fn(),
  };
});

import { useActionData } from 'react-router-dom';

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the welcome back title', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it('should redirect admin to /admin after successful login', async () => {
    // Mock actionData for a successful admin login
    (useActionData as any).mockReturnValue({ success: true, role: 'admin' });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });

  it('should redirect normal user to /profile after successful login', async () => {
    // Mock actionData for a successful user login
    (useActionData as any).mockReturnValue({ success: true, role: 'user' });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile', { replace: true });
    });
  });
});

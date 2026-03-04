import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Invitations, { loader, action } from './Invitations';
import * as profileServiceServer from '../../services/profileService.server';
import * as authServer from '../../lib/auth.server';

vi.mock('../../services/profileService.server');
vi.mock('../../lib/auth.server');

describe('Admin Invitations UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (authServer.getAuthenticatedUser as any).mockResolvedValue({ uid: 'admin123' });
    (authServer.requireRole as any).mockResolvedValue({ user: { uid: 'admin123' }, role: 'admin' });
  });

  const renderComponent = () => {
    const routes = [
      {
        path: '/admin/invitations',
        element: <Invitations />,
        loader: loader,
        action: action,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/admin/invitations'],
    });
    return render(<RouterProvider router={router} />);
  };

  it('should render the invitation form', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /generate invitation/i })).toBeInTheDocument();
    });
  });

  it('should call createInvitation action and display the code on success', async () => {
    (profileServiceServer.createInvitation as any).mockResolvedValue({ inviteCode: 'ABC12345' });

    renderComponent();

    await waitFor(() => screen.getByLabelText(/mobile number/i));

    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: '+1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /generate invitation/i }));

    await waitFor(() => {
      expect(profileServiceServer.createInvitation).toHaveBeenCalledWith('admin123', '+1234567890', 'editor');
      expect(screen.getByText('ABC12345')).toBeInTheDocument();
    });
  });
});

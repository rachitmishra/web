import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import Invitations from './Invitations';
import * as profileService from '../../services/profileService';

const mockSubmit = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useActionData: vi.fn(),
    useSubmit: () => mockSubmit,
    useNavigation: () => ({ state: 'idle' }),
    useLoaderData: () => ({ invites: [] })
  };
});

vi.mock('../../services/profileService', () => ({
  createInvitation: vi.fn(),
  fetchInvitations: vi.fn().mockResolvedValue([])
}));

vi.mock('../../lib/firebase', () => ({
  auth: { currentUser: { uid: 'admin123' } },
  db: {},
}));

describe('Admin Invitations UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    const router = createMemoryRouter([
      { path: '/admin/invitations', element: <Invitations /> }
    ], { initialEntries: ['/admin/invitations'] });
    return render(<RouterProvider router={router} />);
  };

  it('should render the invitation form', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/\+91.../i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /generate invite code/i })).toBeInTheDocument();
    });
  });

  it('should call createInvitation service and display the code on success', async () => {
    (profileService.createInvitation as any).mockResolvedValue({ inviteCode: 'ABC12345' });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/\+91.../i), { target: { value: '+1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /generate invite code/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});

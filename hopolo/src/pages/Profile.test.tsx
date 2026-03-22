import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Profile, { loader, action } from './Profile';
import * as profileService from '../services/profileService';
import * as orderService from '../services/orderService';
import * as profileServiceServer from '../services/profileService.server';
import * as authServer from '../lib/auth.server';

vi.mock('../services/profileService');
vi.mock('../services/orderService');
vi.mock('../services/profileService.server');
vi.mock('../lib/auth.server');
vi.mock('../lib/firebase', () => ({
  auth: { 
    currentUser: { uid: 'user123' },
    onAuthStateChanged: vi.fn((cb) => {
      cb({ uid: 'user123' });
      return vi.fn();
    }),
  },
  db: {},
}));

const mockProfile = {
  uid: 'user123',
  displayName: 'John Doe',
  emoji: '👋',
  addresses: [{ street: '123 Main St', city: 'City', zip: '12345' }],
};

describe('Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (authServer.getAuthenticatedUser as any).mockResolvedValue({ uid: 'user123' });
    (profileServiceServer.getSecureProfile as any).mockResolvedValue(mockProfile);
    (orderService.fetchOrdersByUserId as any).mockResolvedValue([]);
  });

  const renderComponent = () => {
    const routes = [
      {
        path: '/profile',
        element: <Profile />,
        loader: loader,
        action: action,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/profile'],
    });
    return render(<RouterProvider router={router} />);
  };

  it('should render profile data on load', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('👋')).toBeInTheDocument();
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
    });
  });

  it('should call updateProfile action when save is clicked', async () => {
    (profileServiceServer.updateSecureProfile as any).mockResolvedValue({ success: true });
    renderComponent();

    await waitFor(() => screen.getByDisplayValue('John Doe'));
    
    const input = screen.getByLabelText(/display name/i);
    fireEvent.change(input, { target: { value: 'Jane Doe' } });
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(profileServiceServer.updateSecureProfile).toHaveBeenCalledWith('user123', expect.objectContaining({
        displayName: 'Jane Doe'
      }));
    });
  });

  it('should fetch and display user orders', async () => {
    const mockOrders = [
      { id: 'o1', total: 100, status: 'paid', createdAt: { toDate: () => new Date() } },
      { id: 'o2', total: 200, status: 'shipped', createdAt: { toDate: () => new Date() } },
    ];
    (orderService.fetchOrdersByUserId as any).mockResolvedValue(mockOrders);

    renderComponent();

    await waitFor(() => {
      expect(orderService.fetchOrdersByUserId).toHaveBeenCalledWith('user123');
      expect(screen.getByText(/o1/i)).toBeInTheDocument();
      expect(screen.getByText(/o2/i)).toBeInTheDocument();
      expect(screen.getByText('$100.00')).toBeInTheDocument();
      expect(screen.getByText('$200.00')).toBeInTheDocument();
    });
  });

  it('should display the admin badge and link for admin users', async () => {
    (profileServiceServer.getSecureProfile as any).mockResolvedValue({
      ...mockProfile,
      role: 'admin',
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/admin/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /admin panel/i })).toBeInTheDocument();
    });
  });
});

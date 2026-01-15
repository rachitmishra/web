import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import AdminStorefront, { loader, action } from './Storefront';
import * as storefrontService from '../../services/storefrontService';

vi.mock('../../services/storefrontService');
vi.mock('../../lib/auth.server', () => ({
  requireRole: vi.fn().mockResolvedValue({ user: { uid: 'admin123' }, role: 'admin' }),
  getAuthenticatedUser: vi.fn().mockResolvedValue({ uid: 'admin123' }),
}));

const mockSettings = {
  bannerText: 'Initial Banner',
  bannerColor: '#ff0000',
  bannerLink: '/promo',
  bannerVisible: true,
  isMaintenanceMode: false,
};

describe('AdminStorefront Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (storefrontService.getStorefrontSettings as any).mockResolvedValue(mockSettings);
  });

  const renderComponent = () => {
    const routes = [
      {
        path: '/admin/storefront',
        element: <AdminStorefront />,
        loader: loader,
        action: action,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/admin/storefront'],
    });
    return render(<RouterProvider router={router} />);
  };

  it('should render settings from loader', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText(/banner text/i)).toHaveValue(mockSettings.bannerText);
      expect(screen.getByLabelText(/banner color/i)).toHaveValue(mockSettings.bannerColor);
      expect(screen.getByLabelText(/maintenance mode/i)).not.toBeChecked();
    });
  });

  it('should call updateStorefrontSettings on save', async () => {
    (storefrontService.updateStorefrontSettings as any).mockResolvedValue(undefined);
    renderComponent();

    await waitFor(() => screen.getByLabelText(/banner text/i));

    fireEvent.change(screen.getByLabelText(/banner text/i), { target: { value: 'New Banner' } });
    fireEvent.click(screen.getByRole('button', { name: /save settings/i }));

    await waitFor(() => {
      expect(storefrontService.updateStorefrontSettings).toHaveBeenCalledWith(expect.objectContaining({
        bannerText: 'New Banner',
      }));
    });
  });
});

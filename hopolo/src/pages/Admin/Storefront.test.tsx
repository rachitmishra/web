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

const mockSettings: storefrontService.StorefrontSettings = {
  bannerText: 'Initial Banner',
  bannerColor: '#ff0000',
  bannerLink: '/promo',
  bannerVisible: true,
  isMaintenanceMode: false,
  heroTitle: 'Welcome to Hopolo',
  heroSubtitle: 'The best products',
  heroImage: 'https://example.com/hero.jpg',
  heroCtaText: 'Shop Now',
  reviews: [
    { name: 'John', emoji: '😊', text: 'Great!' },
  ],
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

  it('should render all settings from loader', async () => {
    renderComponent();

    await waitFor(() => {
      // Existing
      expect(screen.getByLabelText(/banner text/i)).toHaveValue(mockSettings.bannerText);
      expect(screen.getByLabelText(/banner color/i)).toHaveValue(mockSettings.bannerColor);
      
      // New Hero Fields
      expect(screen.getByLabelText(/hero title/i)).toHaveValue(mockSettings.heroTitle);
      expect(screen.getByLabelText(/hero subtitle/i)).toHaveValue(mockSettings.heroSubtitle);
      expect(screen.getByLabelText(/hero image url/i)).toHaveValue(mockSettings.heroImage);
      expect(screen.getByLabelText(/cta text/i)).toHaveValue(mockSettings.heroCtaText);
    });
  });

  it('should render reviews and allow adding new ones', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/john/i)).toBeInTheDocument();
      expect(screen.getByText(/great!/i)).toBeInTheDocument();
    });

    // Add review
    fireEvent.click(screen.getByRole('button', { name: /add review/i }));
    
    // Check if new inputs appear or if it's a modal/inline
    // For now assume inline addition as per typical React pattern
    const nameInputs = screen.getAllByLabelText(/reviewer name/i);
    fireEvent.change(nameInputs[nameInputs.length - 1], { target: { value: 'Jane' } });
    
    expect(screen.getByDisplayValue(/jane/i)).toBeInTheDocument();
  });

  it('should call updateStorefrontSettings with all fields on save', async () => {
    (storefrontService.updateStorefrontSettings as any).mockResolvedValue(undefined);
    renderComponent();

    await waitFor(() => screen.getByLabelText(/hero title/i));

    fireEvent.change(screen.getByLabelText(/hero title/i), { target: { value: 'New Hero Title' } });
    fireEvent.click(screen.getByRole('button', { name: /save settings/i }));

    await waitFor(() => {
      expect(storefrontService.updateStorefrontSettings).toHaveBeenCalledWith(expect.objectContaining({
        heroTitle: 'New Hero Title',
        heroSubtitle: mockSettings.heroSubtitle,
        reviews: expect.arrayContaining([expect.objectContaining({ name: 'John' })]),
      }));
    });
  });
});

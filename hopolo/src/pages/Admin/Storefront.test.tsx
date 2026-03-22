import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import AdminStorefront from './Storefront';
import * as storefrontService from '../../services/storefrontService';

const mockSubmit = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: () => ({
      settings: mockSettings
    }),
    useActionData: vi.fn(),
    useSubmit: () => mockSubmit
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLoaderData: () => ({
      settings: mockSettings
    }),
    useActionData: vi.fn(),
    useSubmit: () => mockSubmit
  };
});


vi.mock('../../services/storefrontService', () => ({
  getStorefrontSettings: vi.fn(),
  updateStorefrontSettings: vi.fn()
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
    const router = createMemoryRouter([
      { path: '/admin/storefront', element: <AdminStorefront /> }
    ], { initialEntries: ['/admin/storefront'] });
    return render(<RouterProvider router={router} />);
  };

  it('should render all settings from service', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockSettings.heroTitle)).toBeInTheDocument();
    });
  });

  it('should call updateStorefrontSettings with all fields on save', async () => {
    (storefrontService.updateStorefrontSettings as any).mockResolvedValue(undefined);
    renderComponent();

    await waitFor(() => screen.getByDisplayValue(mockSettings.heroTitle));

    fireEvent.change(screen.getByDisplayValue(mockSettings.heroTitle), { target: { value: 'New Hero Title' } });
    fireEvent.click(screen.getByRole('button', { name: /save settings/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});

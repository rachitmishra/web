import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminStorefront from './Storefront';
import * as storefrontService from '../../services/storefrontService';

vi.mock('../../services/storefrontService');

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
    return render(
      <MemoryRouter>
        <AdminStorefront />
      </MemoryRouter>
    );
  };

  it('should render all settings from service', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText(/banner text/i)).toHaveValue(mockSettings.bannerText);
      expect(screen.getByLabelText(/hero title/i)).toHaveValue(mockSettings.heroTitle);
    });
  });

  it('should render reviews and allow adding new ones', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue(/john/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /add review/i }));
    
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
      }));
      expect(screen.getByText(/settings saved successfully/i)).toBeInTheDocument();
    });
  });
});

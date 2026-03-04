import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import * as productService from '../services/productService';
import * as storefrontService from '../services/storefrontService';
import { useSEO } from '../hooks/useSEO';

vi.mock('../services/productService');
vi.mock('../services/storefrontService');
vi.mock('../hooks/useSEO');

const mockProducts: productService.Product[] = [
  { id: '1', name: 'Product 1', price: 10, category: 'cat1' },
  { id: '2', name: 'Product 2', price: 20, category: 'cat2' },
];

const mockCategories: productService.Category[] = [
  { id: 'all', name: 'All' },
  { id: 'cat1', name: 'Electronics' },
  { id: 'cat2', name: 'Clothing' },
];

const mockBestSellers: productService.Product[] = [
  { id: 'bs1', name: 'Best Seller Product', price: 50, category: 'cat1' },
];

const mockSettings: storefrontService.StorefrontSettings = {
  bannerText: 'Dynamic Banner',
  bannerColor: '#0000ff',
  bannerLink: '/dynamic',
  bannerVisible: true,
  isMaintenanceMode: false,
  heroTitle: 'Dynamic Hero Title',
  heroSubtitle: 'Dynamic Subtitle',
  heroImage: 'https://example.com/dynamic.jpg',
  heroCtaText: 'Explore Now',
  reviews: [
    { name: 'Alice', emoji: '🌟', text: 'Dynamic Review!' },
  ],
};

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (productService.fetchProducts as any).mockResolvedValue(mockProducts);
    (productService.fetchCategories as any).mockResolvedValue(mockCategories);
    (productService.fetchBestSellers as any).mockResolvedValue(mockBestSellers);
    (storefrontService.getStorefrontSettings as any).mockResolvedValue(mockSettings);
  });

  it('should render products and categories on load', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/product 1/i)).toBeInTheDocument();
      expect(screen.getByText(/product 2/i)).toBeInTheDocument();
      expect(screen.getByText(/electronics/i)).toBeInTheDocument();
    });
  });

  it('should render the dynamic cinematic hero', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/dynamic hero title/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /explore now/i })).toBeInTheDocument();
    });
  });

  it('should render the dynamic reviews section', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/loved by customers/i)).toBeInTheDocument();
      expect(screen.getByText(/alice/i)).toBeInTheDocument();
      expect(screen.getByText(/dynamic review!/i)).toBeInTheDocument();
    });
  });

  it('should filter products when a category tab is clicked', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    await waitFor(() => screen.getByText(/electronics/i));
    
    fireEvent.click(screen.getByText(/electronics/i));
    
    await waitFor(() => {
      expect(screen.getByText(/product 1/i)).toBeInTheDocument();
      expect(screen.queryByText(/product 2/i)).not.toBeInTheDocument();
    });
  });

  it('should call useSEO hook', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(useSEO).toHaveBeenCalled();
  });
});

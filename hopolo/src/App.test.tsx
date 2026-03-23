import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from './App';
import * as productService from './services/productService';
import * as cartService from './services/cartService';
import * as reviewService from './services/reviewService';
import * as storefrontService from './services/storefrontService';
import * as profileService from './services/profileService';
import { auth } from './lib/firebase';

vi.mock('./services/productService');
vi.mock('./services/cartService', () => ({
  subscribeToCart: vi.fn(() => vi.fn()),
  addToCart: vi.fn(),
  getCartItems: vi.fn().mockResolvedValue([])
}));
vi.mock('./services/reviewService');
vi.mock('./services/storefrontService');
vi.mock('./services/profileService');

vi.mock('./lib/firebase', () => {
  const auth = {
    currentUser: null,
    onAuthStateChanged: vi.fn((cb) => {
      cb(null);
      return vi.fn();
    }),
  };
  return { auth, db: {} };
});

const mockProducts: productService.Product[] = [
  { id: '1', name: 'Product 1', price: 10, category: 'cat1' },
];

const mockCategories: productService.Category[] = [
  { id: 'all', name: 'All' },
];

describe('App Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (productService.fetchProducts as any).mockResolvedValue(mockProducts);
    (productService.fetchCategories as any).mockResolvedValue(mockCategories);
    (productService.fetchBestSellers as any).mockResolvedValue(mockProducts);
    (productService.fetchProductById as any).mockResolvedValue(mockProducts[0]);
    (reviewService.fetchReviews as any).mockResolvedValue([]);
    (storefrontService.subscribeToStorefrontSettings as any).mockImplementation((cb: any) => {
      cb({ isMaintenanceMode: false, heroTitle: 'Hopolo Boutique', reviews: [] });
      return () => {};
    });
    (storefrontService.getStorefrontSettings as any).mockResolvedValue({
      heroTitle: 'Hopolo Boutique',
      heroSubtitle: 'Discover unique products',
      heroImage: '',
      heroCtaText: 'Shop Now',
      reviews: []
    });
    (auth.currentUser as any) = { uid: 'user123' }; 
  });

  const renderApp = (initialEntry = '/') => {
    const router = createMemoryRouter(routes, {
      initialEntries: [initialEntry]
    });
    return render(<RouterProvider router={router} />);
  };

  it('should navigate from Home to Product Detail when a card is clicked', async () => {
    renderApp('/');
    
    const productCard = await waitFor(() => screen.getByTestId('product-card-1'));
    fireEvent.click(productCard);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /product 1/i })).toBeInTheDocument();
    });
  });

  it('should navigate back to Home from Product Detail', async () => {
    renderApp('/product/1');
    
    await waitFor(() => screen.getByRole('heading', { name: /product 1/i }));
    
    const backButton = screen.getByRole('button', { name: /← back/i });
    fireEvent.click(backButton);
    
    await waitFor(() => {
      expect(screen.getByText(/hopolo boutique/i)).toBeInTheDocument();
    });
  });

  it('should redirect to login when accessing profile while logged out', async () => {
    (auth.currentUser as any) = null;
    (auth.onAuthStateChanged as any).mockImplementation((cb: any) => {
      cb(null);
      return vi.fn();
    });

    renderApp('/profile');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /auth/i })).toBeInTheDocument();
    });
  });
});

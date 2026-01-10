import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import * as productService from './services/productService';
import * as cartService from './services/cartService';
import { auth } from './lib/firebase';

vi.mock('./services/productService');
vi.mock('./services/cartService', () => ({
  subscribeToCart: vi.fn(() => vi.fn()),
  addToCart: vi.fn(),
}));

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
    (auth.currentUser as any) = { uid: 'user123' }; // Default to logged in for basic routing tests
  });

  it('should navigate from Home to Product Detail when a card is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    const productCard = await waitFor(() => screen.getByTestId('product-card-1'));
    fireEvent.click(productCard);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /product 1/i })).toBeInTheDocument();
    });
  });

  it('should navigate back to Home from Product Detail', async () => {
    render(
      <MemoryRouter initialEntries={['/', '/product/1']} initialIndex={1}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    await waitFor(() => screen.getByRole('heading', { name: /product 1/i }));
    
    const backButton = screen.getByRole('button', { name: /back/i });
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

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    });
  });
});
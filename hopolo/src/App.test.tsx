import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import * as productService from './services/productService';

vi.mock('./services/productService');

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
  });

  it('should navigate from Home to Product Detail when a card is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    const productCard = await waitFor(() => screen.getByTestId('product-card-1'));
    fireEvent.click(productCard);
    
    // Should be on Product Detail page
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
});

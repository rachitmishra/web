import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import * as productService from '../services/productService';
import { useSEO } from '../hooks/useSEO';

vi.mock('../services/productService');
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

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (productService.fetchProducts as any).mockResolvedValue(mockProducts);
    (productService.fetchCategories as any).mockResolvedValue(mockCategories);
    (productService.fetchBestSellers as any).mockResolvedValue(mockBestSellers);
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

  it('should render the cinematic hero', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/hopolo boutique/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /shop the collection/i })).toBeInTheDocument();
    });
  });

  it('should render the best sellers section', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/best sellers/i)).toBeInTheDocument();
      expect(screen.getByText(/best seller product/i)).toBeInTheDocument();
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

  it('should render the featured reviews section', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/loved by customers/i)).toBeInTheDocument();
      expect(screen.getByText(/amazing quality/i)).toBeInTheDocument();
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
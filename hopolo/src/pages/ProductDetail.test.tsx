import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import * as productService from '../services/productService';

vi.mock('../services/productService');

const mockProduct: productService.Product = {
  id: '1',
  name: 'Cool Product',
  price: 49.99,
  category: 'Test',
  rating: 4.5,
};

describe('ProductDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (productService.fetchProducts as any).mockResolvedValue([mockProduct]);
  });

  it('should render product details correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /cool product/i })).toBeInTheDocument();
      expect(screen.getByText(/\$49.99/i)).toBeInTheDocument();
      expect(screen.getByText(/4.5/i)).toBeInTheDocument();
    });
  });

  it('should show quantity selector and add to cart button', async () => {
    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/increase quantity/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
    });
  });
});

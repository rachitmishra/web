import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Inventory from './Inventory';
import * as productService from '../../services/productService';

vi.mock('../../services/productService');
vi.mock('../../lib/firebase', () => ({
  db: {},
  auth: {},
  storage: {},
}));

const mockProducts = [
  { id: '1', name: 'Product A', price: 50, category: 'Cat A', stock: 10 },
  { id: '2', name: 'Product B', price: 100, category: 'Cat B', stock: 5 },
];

describe('Admin Inventory Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (productService.fetchProducts as any).mockResolvedValue(mockProducts);
  });

  it('should render a list of products', async () => {
    render(
      <MemoryRouter>
        <Inventory />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/inventory/i)).toBeInTheDocument();
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
      expect(screen.getByText('Cat A')).toBeInTheDocument();
      expect(screen.getByText('$50')).toBeInTheDocument(); // Price check
    });
  });

  it('should show add product button', async () => {
    render(
      <MemoryRouter>
        <Inventory />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
    });
  });

  it('should allow adding variants in the product form', async () => {
    render(
      <MemoryRouter>
        <Inventory />
      </MemoryRouter>
    );

    // Open Add Product Modal
    const addBtn = await waitFor(() => screen.getByRole('button', { name: /add product/i }));
    fireEvent.click(addBtn);

    // Check for Variants Section
    await waitFor(() => expect(screen.getByText(/variants/i)).toBeInTheDocument());

    // Add Variant
    const sizeInput = screen.getByPlaceholderText(/size/i);
    const colorInput = screen.getByPlaceholderText(/color/i);
    const stockInput = screen.getByPlaceholderText(/stock/i);
    const addVariantBtn = screen.getByRole('button', { name: /add variant/i });

    fireEvent.change(sizeInput, { target: { value: 'L' } });
    fireEvent.change(colorInput, { target: { value: 'Blue' } });
    fireEvent.change(stockInput, { target: { value: '50' } });
    fireEvent.click(addVariantBtn);

    // Verify Variant Added
    await waitFor(() => {
      expect(screen.getByText('L')).toBeInTheDocument();
      expect(screen.getByText('Blue')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });
});

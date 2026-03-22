import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import Inventory from './Inventory';
import * as productService from '../../services/productService';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: () => ({
      products: mockProducts
    }),
    useActionData: vi.fn(),
    useSubmit: () => vi.fn()
  };
});

vi.mock('../../services/productService', () => ({
  fetchProducts: vi.fn(),
}));

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

  const renderComponent = () => {
    const router = createMemoryRouter([
      { path: '/admin/inventory', element: <Inventory /> }
    ], { initialEntries: ['/admin/inventory'] });
    return render(<RouterProvider router={router} />);
  };

  it('should render a list of products', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/inventory/i)).toBeInTheDocument();
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
      expect(screen.getByText('Cat A')).toBeInTheDocument();
      expect(screen.getByText('$50')).toBeInTheDocument(); // Price check
    });
  });

  it('should show add product button', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
    });
  });

  it('should allow adding variants in the product form', async () => {
    renderComponent();

    // Open Add Product Modal
    const addBtn = await waitFor(() => screen.getByRole('button', { name: /add product/i }));
    fireEvent.click(addBtn);

    // Check for Variants Section
    await waitFor(() => expect(screen.getByText(/variants/i)).toBeInTheDocument());

    // Add Variant
    const sizeInput = screen.getAllByPlaceholderText(/size/i)[0];
    const colorInput = screen.getAllByPlaceholderText(/color/i)[0];
    const stockInput = screen.getAllByPlaceholderText(/stock/i)[0];
    const addVariantBtn = screen.getAllByRole('button', { name: /ADD/i })[0];

    fireEvent.change(sizeInput, { target: { value: 'L' } });
    fireEvent.change(colorInput, { target: { value: 'Blue' } });
    fireEvent.change(stockInput, { target: { value: '50' } });
    fireEvent.click(addVariantBtn);

    // Verify Variant Added
    await waitFor(() => {
      expect(screen.getByDisplayValue('L')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Blue')).toBeInTheDocument();
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    });
  });
});

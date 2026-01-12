import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import * as productService from '../services/productService';
import * as cartService from '../services/cartService';
import * as reviewService from '../services/reviewService';
import { auth } from '../lib/firebase';

vi.mock('../services/productService');
vi.mock('../services/cartService');
vi.mock('../services/reviewService');
vi.mock('../lib/firebase', () => ({
  auth: { currentUser: { uid: 'u1', displayName: 'Alice' } },
  db: {},
}));

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
    (reviewService.fetchReviews as any).mockResolvedValue([]);
    (auth.currentUser as any) = { uid: 'u1', displayName: 'Alice' };
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

  it('should call addToCart when add to cart button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const addButton = await waitFor(() => screen.getByRole('button', { name: /add to cart/i }));
    
    // Increment quantity to 2
    fireEvent.click(screen.getByLabelText(/increase quantity/i));
    
    fireEvent.click(addButton);

    expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct, 2, { size: undefined, color: undefined });
  });

  it('should render rich product details like delivery and art info', async () => {
    const richProduct = {
      ...mockProduct,
      deliveryTime: '3-5 days',
      priceDisclaimer: 'Taxes included',
      artDetails: { Artist: 'Jane Doe', Technique: 'Oil on Canvas' }
    };
    (productService.fetchProducts as any).mockResolvedValue([richProduct]);

    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/3-5 days/i)).toBeInTheDocument();
      expect(screen.getByText(/Taxes included/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Oil on Canvas/i)).toBeInTheDocument();
    });
  });

  it('should fetch and display reviews on load', async () => {
    const mockReviews = [
      { id: 'r1', rating: 3, comment: 'Amazing!', userName: 'Alice' },
      { id: 'r2', rating: 2, comment: 'Ok.', userName: 'Bob' },
    ];
    (reviewService.fetchReviews as any).mockResolvedValue(mockReviews);

    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(reviewService.fetchReviews).toHaveBeenCalledWith('1');
      expect(screen.getByText(/Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/Amazing!/i)).toBeInTheDocument();
      expect(screen.getByText(/Bob/i)).toBeInTheDocument();
      expect(screen.getByText(/Ok./i)).toBeInTheDocument();
    });
  });

  it('should render variant selectors and allow selection', async () => {
    const productWithVariants = {
      ...mockProduct,
      sizes: ['S', 'M'],
      colors: ['Red', 'Blue'],
    };
    (productService.fetchProducts as any).mockResolvedValue([productWithVariants]);

    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Size'));
    
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();

    // Select Size
    fireEvent.click(screen.getByText('M'));
    // Select Color
    fireEvent.click(screen.getByText('Blue'));

    // Click Add to Cart
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(cartService.addToCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1' }), 
      1,
      { size: 'M', color: 'Blue' }
    );
  });
});

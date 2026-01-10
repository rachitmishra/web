import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Checkout from './Checkout';
import * as cartService from '../services/cartService';
import * as profileService from '../services/profileService';

vi.mock('../services/cartService');
vi.mock('../services/profileService');
vi.mock('../lib/firebase', () => ({
  auth: { currentUser: { uid: 'user123' } },
  db: {},
}));

const mockCartItems = [
  { product: { id: '1', name: 'Product 1', price: 100, image: 'img1.jpg' }, quantity: 2 },
  { product: { id: '2', name: 'Product 2', price: 50, image: 'img2.jpg' }, quantity: 1 },
];

const mockProfile = {
  uid: 'user123',
  displayName: 'John Doe',
  addresses: [
    { street: '123 Main St', city: 'City', zip: '12345' },
  ],
};

describe('Checkout Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (cartService.subscribeToCart as any).mockImplementation((callback: any) => {
      callback(mockCartItems);
      return vi.fn();
    });
    (profileService.getUserProfile as any).mockResolvedValue(mockProfile);
  });

  it('should render order summary with correct items and totals', async () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    expect(screen.getByText(/product 1/i)).toBeInTheDocument();
    expect(screen.getByText(/\$250\.00/i)).toBeInTheDocument();
  });

  it('should render saved addresses', async () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';
import * as cartService from '../services/cartService';

vi.mock('../services/cartService');

const mockItems = [
  { product: { id: '1', name: 'Product 1', price: 10 }, quantity: 2 },
  { product: { id: '2', name: 'Product 2', price: 20 }, quantity: 1 },
];

describe('Cart Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (cartService.subscribeToCart as any).mockImplementation((callback: any) => {
      callback(mockItems);
      return vi.fn();
    });
  });

  it('should render all items and the correct subtotal', async () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    expect(screen.getByText(/product 1/i)).toBeInTheDocument();
    expect(screen.getByText(/product 2/i)).toBeInTheDocument();
    expect(screen.getByText(/\$40\.00/i)).toBeInTheDocument(); // 2*10 + 1*20
  });

  it('should call updateQuantity when a quantity is changed', async () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    const increaseButtons = screen.getAllByLabelText(/increase quantity/i);
    fireEvent.click(increaseButtons[0]);

    expect(cartService.updateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('should call removeFromCart when remove is clicked', async () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    expect(cartService.removeFromCart).toHaveBeenCalledWith('1');
  });
});

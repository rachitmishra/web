import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';
import * as cartService from '../services/cartService';
import * as promoService from '../services/promoService';

vi.mock('../services/cartService');
vi.mock('../services/promoService');

describe('Cart Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (cartService.subscribeToCart as any).mockImplementation((cb: any) => {
      cb([
        { product: { id: 'p1', name: 'Product 1', price: 100, category: 'test' }, quantity: 2 },
      ]);
      return vi.fn();
    });
  });

  it('should render all items and the correct subtotal', async () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('$200.00')).toBeInTheDocument();
  });

  it('should call removeFromCart when remove is clicked', async () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    const removeBtn = screen.getByLabelText('Remove item');
    fireEvent.click(removeBtn);

    expect(cartService.removeFromCart).toHaveBeenCalledWith('p1');
  });

  it('should apply promo code and update total', async () => {
    (promoService.validatePromoCode as any).mockResolvedValue({
      discount: 20,
      type: 'fixed',
      value: 20
    });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    const promoInput = screen.getByPlaceholderText(/enter code/i);
    const applyBtn = screen.getByRole('button', { name: /apply/i });

    fireEvent.change(promoInput, { target: { value: 'SAVE20' } });
    fireEvent.click(applyBtn);

    await waitFor(() => {
      expect(promoService.validatePromoCode).toHaveBeenCalledWith('SAVE20', 200);
      expect(screen.getByText(/discount/i)).toBeInTheDocument();
      expect(screen.getByText(/-\$20.00/i)).toBeInTheDocument();
      expect(screen.getByText(/\$185.99/i)).toBeInTheDocument();
    });
  });
});

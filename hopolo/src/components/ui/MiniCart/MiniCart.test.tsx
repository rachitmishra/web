import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MiniCart from './MiniCart';
import * as cartService from '../../../services/cartService';

vi.mock('../../../services/cartService');

describe('MiniCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (cartService.subscribeToCart as any).mockReturnValue(vi.fn());
  });

  it('should not have drawerOpen class when isOpen is false', () => {
    render(
      <MemoryRouter>
        <MiniCart isOpen={false} onClose={() => {}} />
      </MemoryRouter>
    );
    const drawer = screen.getByRole('heading', { name: /your cart/i }).closest('div[class*="drawer"]');
    expect(drawer).not.toHaveClass(/drawerOpen/i);
  });

  it('should render cart items when open', () => {
    (cartService.subscribeToCart as any).mockImplementation((callback: any) => {
      callback([{ product: { id: '1', name: 'Product 1', price: 10 }, quantity: 2 }]);
      return vi.fn(); // Return a mock unsubscribe function
    });

    render(
      <MemoryRouter>
        <MiniCart isOpen={true} onClose={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /your cart \(2\)/i })).toBeInTheDocument();
    expect(screen.getByText(/product 1/i)).toBeInTheDocument();
    expect(screen.getByText(/2 x \$10\.00/i)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <MemoryRouter>
        <MiniCart isOpen={true} onClose={handleClose} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByLabelText(/close cart/i));
    expect(handleClose).toHaveBeenCalled();
  });
});
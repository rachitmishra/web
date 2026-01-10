import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import * as cartService from '../../../services/cartService';

vi.mock('../../../services/cartService');

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the logo and cart icon', () => {
    (cartService.subscribeToCart as any).mockReturnValue(vi.fn());
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText(/hopolo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/shopping cart/i)).toBeInTheDocument();
  });

  it('should display the correct item count badge', () => {
    // Mock subscription to trigger with 3 items
    (cartService.subscribeToCart as any).mockImplementation((callback: any) => {
      callback([
        { product: { id: '1' }, quantity: 1 },
        { product: { id: '2' }, quantity: 2 },
      ]);
      return vi.fn();
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

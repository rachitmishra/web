import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Marketing from './Marketing';
import * as promoService from '../../services/promoService';

vi.mock('../../services/promoService');

const mockPromoCodes: any[] = [
  { id: '1', code: 'SAVE10', value: 10, type: 'percentage', minPurchase: 50 },
  { id: '2', code: 'FIXED20', value: 20, type: 'fixed', minPurchase: 100 },
];

describe('Admin Marketing Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (promoService.fetchPromoCodes as any) = vi.fn().mockResolvedValue(mockPromoCodes);
  });

  it('should render a list of promo codes', async () => {
    render(
      <MemoryRouter>
        <Marketing />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/marketing dashboard/i)).toBeInTheDocument();
      expect(screen.getByText('SAVE10')).toBeInTheDocument();
      expect(screen.getByText('FIXED20')).toBeInTheDocument();
      expect(screen.getByText('10%')).toBeInTheDocument();
      expect(screen.getByText('$20.00')).toBeInTheDocument();
    });
  });

  it('should allow adding a new promo code', async () => {
    (promoService.addPromoCode as any) = vi.fn().mockResolvedValue('new_id');

    render(
      <MemoryRouter>
        <Marketing />
      </MemoryRouter>
    );

    const openFormBtn = await waitFor(() => screen.getByRole('button', { name: /add promo/i }));
    fireEvent.click(openFormBtn);

    fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'WELCOME' } });
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '5' } });
    
    const submitBtn = screen.getByRole('button', { name: /save promo/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(promoService.addPromoCode).toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OrderDetail from './OrderDetail';
import * as orderService from '../../services/orderService';

vi.mock('../../services/orderService');

const mockOrder = {
  id: 'o123',
  userId: 'u456',
  total: 1500,
  status: 'paid',
  paymentId: 'pay_123',
  items: [
    { productId: 'p1', name: 'Product 1', price: 500, quantity: 2 },
    { productId: 'p2', name: 'Product 2', price: 500, quantity: 1 }
  ],
  address: {
    street: '123 Main St',
    city: 'Tech City',
    zip: '560001'
  },
  createdAt: { toDate: () => new Date('2026-01-11') }
};

describe('OrderDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render order details correctly', async () => {
    (orderService.fetchOrderById as any).mockResolvedValue(mockOrder);

    render(
      <MemoryRouter initialEntries={['/admin/orders/o123']}>
        <Routes>
          <Route path="/admin/orders/:id" element={<OrderDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Order o123/i)).toBeInTheDocument();
      expect(screen.getByText(/Total: ₹1500/i)).toBeInTheDocument();
      expect(screen.getByText(/Status:/i)).toBeInTheDocument();
      expect(screen.getByText('paid')).toBeInTheDocument();
      expect(screen.getByText(/Product 1 x 2/i)).toBeInTheDocument();
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
      expect(screen.getByText(/Tech City/i)).toBeInTheDocument();
    });
  });

  it('should show error if order not found', async () => {
    (orderService.fetchOrderById as any).mockResolvedValue(null);

    render(
      <MemoryRouter initialEntries={['/admin/orders/invalid']}>
        <Routes>
          <Route path="/admin/orders/:id" element={<OrderDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Order not found/i)).toBeInTheDocument();
    });
  });
});

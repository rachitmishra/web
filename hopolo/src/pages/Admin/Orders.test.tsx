import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Orders from './Orders';
import * as orderService from '../../services/orderService';

vi.mock('../../services/orderService');
vi.mock('../../lib/firebase', () => ({
  auth: { currentUser: { uid: 'admin123' } },
  db: {},
}));

const mockOrders = [
  { 
    id: 'order1', 
    userId: 'user1', 
    total: 100, 
    status: 'paid', 
    createdAt: { toDate: () => new Date() } 
  },
  { 
    id: 'order2', 
    userId: 'user2', 
    total: 200, 
    status: 'shipped', 
    createdAt: { toDate: () => new Date() } 
  },
];

describe('Admin Orders Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (orderService.fetchAllOrders as any).mockResolvedValue(mockOrders);
  });

  it('should render a list of orders', async () => {
    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/admin orders/i)).toBeInTheDocument();
      expect(screen.getByText('order1')).toBeInTheDocument();
      expect(screen.getByText('order2')).toBeInTheDocument();
      expect(screen.getByText('$100.00')).toBeInTheDocument();
      expect(screen.getByText('$200.00')).toBeInTheDocument();
    });
  });

  it('should display analytics metrics correctly', async () => {
    const customMockOrders = [
      { id: 'o1', total: 100, status: 'paid', createdAt: { toDate: () => new Date() } },
      { id: 'o2', total: 200, status: 'paid', createdAt: { toDate: () => new Date() } },
      { id: 'o3', total: 300, status: 'refunded', createdAt: { toDate: () => new Date() } },
    ];
    (orderService.fetchAllOrders as any).mockResolvedValue(customMockOrders);

    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Logic: Total Sales = 100 + 200 = 300 (excluding refunded)
      // AOV = 300 / 2 = 150
      expect(screen.getByTestId('total-sales')).toHaveTextContent('$300.00');
      expect(screen.getByTestId('avg-order-value')).toHaveTextContent('$150.00');
      expect(screen.getByTestId('total-orders')).toHaveTextContent('3');
    });
  });

  it('should render navigation buttons including Storefront', async () => {
    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /inventory/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /marketing/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /storefront/i })).toBeInTheDocument();
    });
  });
});

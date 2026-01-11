import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Success from './Success';
import * as orderService from '../services/orderService';

vi.mock('../services/orderService');

const mockOrder = {
  id: 'order_123',
  total: 150,
  status: 'paid',
  items: [
    { name: 'Product A', quantity: 2, price: 50 },
    { name: 'Product B', quantity: 1, price: 50 },
  ],
  address: {
    street: '123 Test St',
    city: 'Demo City',
    zip: '12345'
  },
  createdAt: { toDate: () => new Date() }
};

describe('Success Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Order ID and success message', () => {
    (orderService.fetchOrderById as any).mockResolvedValue(mockOrder);
    
    render(
      <MemoryRouter initialEntries={['/checkout/success/order_123']}>
        <Routes>
          <Route path="/checkout/success/:orderId" element={<Success />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/order_123/i)).toBeInTheDocument();
  });

  it('should fetch and display order details', async () => {
    (orderService.fetchOrderById as any).mockResolvedValue(mockOrder);

    render(
      <MemoryRouter initialEntries={['/checkout/success/order_123']}>
        <Routes>
          <Route path="/checkout/success/:orderId" element={<Success />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(orderService.fetchOrderById).toHaveBeenCalledWith('order_123');
      expect(screen.getByText(/\$150.00/i)).toBeInTheDocument();
      expect(screen.getByText(/Product A/i)).toBeInTheDocument();
      expect(screen.getByText(/Product B/i)).toBeInTheDocument();
      expect(screen.getByText(/123 Test St/i)).toBeInTheDocument();
    });
  });
});

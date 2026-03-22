import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import OrderDetail from './OrderDetail';
import * as shippingService from '../../services/shippingService';
import * as paymentService from '../../services/paymentService';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(() => ({
      order: mockOrder
    })),
    useActionData: vi.fn(),
    useSubmit: vi.fn(),
    useNavigate: () => vi.fn()
  };
});

vi.mock('../../services/orderService', () => ({
  fetchOrderById: vi.fn(),
  updateOrderStatus: vi.fn()
}));
vi.mock('../../services/shippingService', () => ({
  createShippingOrder: vi.fn()
}));
vi.mock('../../services/paymentService', () => ({
  refundOrder: vi.fn()
}));

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
  createdAt: { toDate: () => new Date('2026-01-11') },
  phone: '1234567890' // Added phone for shipping
};

import { useLoaderData, useSubmit, useNavigate } from 'react-router';

describe('OrderDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (mockUseSubmit = vi.fn()) => {
    vi.mocked(useSubmit).mockReturnValue(mockUseSubmit as any);
    const router = createMemoryRouter([
      { path: '/admin/orders', element: <div>Orders Page</div> },
      { path: '/admin/orders/:id', element: <OrderDetail /> }
    ], { initialEntries: ['/admin/orders/o123'] });
    return render(<RouterProvider router={router} />);
  };

  it('should render order details correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Order o123/i)).toBeInTheDocument();
      expect(screen.getByText(/Total: ₹1500/i)).toBeInTheDocument();
      expect(screen.getByText(/Status:/i)).toBeInTheDocument();
      expect(screen.getByText('paid')).toBeInTheDocument();
      expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
      expect(screen.getByText(/Tech City/i)).toBeInTheDocument();
    });
  });

  it('should handle shipping process when Ship button is clicked', async () => {
    const mockSubmit = vi.fn();
    renderComponent(mockSubmit);

    await waitFor(() => screen.getByText('Ship with Shadowfax'));

    const shipBtn = screen.getByText('Ship with Shadowfax');
    fireEvent.click(shipBtn);

    expect(mockSubmit).toHaveBeenCalledWith({ intent: "ship-order" }, { method: "post" });
  });

  it('should handle refund process when Refund button is clicked', async () => {
    const mockSubmit = vi.fn();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderComponent(mockSubmit);

    await waitFor(() => screen.getByText('Issue Refund'));

    const refundBtn = screen.getByText('Issue Refund');
    fireEvent.click(refundBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalledWith({ intent: "refund-order" }, { method: "post" });
  });

  it('should show error if order not found', async () => {
    (useLoaderData as any).mockReturnValueOnce({ order: null });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Order not found/i)).toBeInTheDocument();
    });
  });
});

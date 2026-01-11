import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OrderDetail from './OrderDetail';
import * as orderService from '../../services/orderService';
import * as shippingService from '../../services/shippingService';
import * as paymentService from '../../services/paymentService';

vi.mock('../../services/orderService');
vi.mock('../../services/shippingService');
vi.mock('../../services/paymentService');

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

  it('should handle shipping process when Ship button is clicked', async () => {
    (orderService.fetchOrderById as any).mockResolvedValue(mockOrder);
    (shippingService.createShippingOrder as any).mockResolvedValue({
      trackingId: 'SFX123',
      labelUrl: 'http://label.url'
    });
    (orderService.updateOrderStatus as any).mockResolvedValue();

    render(
      <MemoryRouter initialEntries={['/admin/orders/o123']}>
        <Routes>
          <Route path="/admin/orders/:id" element={<OrderDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Ship with Shadowfax'));

    const shipBtn = screen.getByText('Ship with Shadowfax');
    fireEvent.click(shipBtn);

    await waitFor(() => {
      expect(shippingService.createShippingOrder).toHaveBeenCalledWith(expect.objectContaining({
        orderId: 'o123',
        customerName: 'u456', // Simplified mapping for now
        phone: '1234567890',
        address: expect.stringContaining('123 Main St'),
      }));
      expect(orderService.updateOrderStatus).toHaveBeenCalledWith('o123', 'shipped');
    });
  });

  it('should handle refund process when Refund button is clicked', async () => {
    (orderService.fetchOrderById as any).mockResolvedValue(mockOrder);
    (paymentService.refundOrder as any).mockResolvedValue({
      refundId: 'rfnd_123',
      status: 'processed'
    });
    (orderService.updateOrderStatus as any).mockResolvedValue();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/admin/orders/o123']}>
        <Routes>
          <Route path="/admin/orders/:id" element={<OrderDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Issue Refund'));

    const refundBtn = screen.getByText('Issue Refund');
    fireEvent.click(refundBtn);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(paymentService.refundOrder).toHaveBeenCalledWith('pay_123', 1500);
      expect(orderService.updateOrderStatus).toHaveBeenCalledWith('o123', 'refunded');
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

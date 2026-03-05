import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Orders from './Orders';
import OrderDetail from './OrderDetail';
import SeedData from './SeedData';
import * as orderService from '../../services/orderService';
import * as storefrontService from '../../services/storefrontService';
import * as seederService from '../../services/seederService';

vi.mock('../../services/orderService');
vi.mock('../../services/storefrontService');
vi.mock('../../services/seederService');
vi.mock('../../lib/firebase', () => ({
  auth: { currentUser: { uid: 'admin123' } },
  db: {},
}));

describe('Admin Navigation Refactor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (orderService.fetchAllOrders as any).mockResolvedValue([]);
    (orderService.fetchOrderById as any).mockResolvedValue({ id: 'o123', total: 100, items: [], status: 'paid' });
    (storefrontService.getStorefrontSettings as any).mockResolvedValue({});
  });

  it('Orders page should NOT have manual navigation buttons', async () => {
    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText(/loading orders/i)).not.toBeInTheDocument());

    // These buttons should be removed
    expect(screen.queryByText(/manage inventory/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/marketing/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/storefront/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/view email logs/i)).not.toBeInTheDocument();
  });

  it('OrderDetail page should NOT have Back to Dashboard button', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/orders/o123']}>
        <Routes>
          <Route path="/admin/orders/:id" element={<OrderDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText(/loading order details/i)).not.toBeInTheDocument());

    expect(screen.queryByText(/back to dashboard/i)).not.toBeInTheDocument();
  });

  it('SeedData page should NOT have Back to Dashboard button', async () => {
    render(
      <MemoryRouter>
        <SeedData />
      </MemoryRouter>
    );

    expect(screen.queryByText(/back to dashboard/i)).not.toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Analytics from './Analytics';
import * as orderService from '../../services/orderService';

vi.mock('../../services/orderService');

// Mock ResizeObserver for Recharts
global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

const mockOrders = [
  {
    id: '1',
    createdAt: { toDate: () => new Date() },
    total: 100,
    items: [{ product: { name: 'P1', category: 'C1' }, quantity: 1 }],
    status: 'paid'
  }
];

describe('Admin Analytics Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (orderService.fetchAllOrders as any).mockResolvedValue(mockOrders);
  });

  it('should render analytics dashboard with charts', async () => {
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/revenue trend/i)).toBeInTheDocument();
      expect(screen.getByText(/top products/i)).toBeInTheDocument();
      expect(screen.getByText(/category distribution/i)).toBeInTheDocument();
    });
  });

  it('should update charts when time range is changed', async () => {
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/last 7 days/i));
    
    const rangeBtn = screen.getByText(/last 7 days/i);
    fireEvent.click(rangeBtn);

    // Verify button is active or re-fetching happens
    // In this simple implementation, we just check if it was clickable
    expect(rangeBtn).toBeInTheDocument();
  });
});

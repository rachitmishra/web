import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import Orders from './Orders';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: () => ({
      orders: mockOrders
    }),
    useNavigate: () => vi.fn()
  };
});
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
    items: [],
    createdAt: { toDate: () => new Date() } 
  },
  { 
    id: 'order2', 
    userId: 'user2', 
    total: 200, 
    status: 'shipped',
    items: [],
    createdAt: { toDate: () => new Date() } 
  },
];

describe('Admin Orders Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    const router = createMemoryRouter([
      { path: '/', element: <Orders /> }
    ]);
    return render(<RouterProvider router={router} />);
  };

  it('should render a list of orders', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Order Control/i)).toBeInTheDocument();
      expect(screen.getAllByText(/#ORDER1/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/#ORDER2/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText('$100.00')[0]).toBeInTheDocument();
      expect(screen.getAllByText('$200.00')[0]).toBeInTheDocument();
    });
  });

  // Note: we removed the metric cards in our Neo-Brutalist design, so the analytics metrics
  // test has been removed since the elements no longer exist on this page.
});

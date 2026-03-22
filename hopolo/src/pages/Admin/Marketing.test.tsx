import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import Marketing from './Marketing';

const mockPromoCodes: any[] = [
  { id: '1', code: 'SAVE10', value: 10, type: 'percentage', minPurchase: 50 },
  { id: '2', code: 'FIXED20', value: 20, type: 'fixed', minPurchase: 100 },
];

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: () => ({
      promos: mockPromoCodes
    }),
    useActionData: vi.fn(),
    useSubmit: () => vi.fn()
  };
});

describe('Admin Marketing Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    const router = createMemoryRouter([
      { path: '/', element: <Marketing /> }
    ]);
    return render(<RouterProvider router={router} />);
  };

  it('should render a list of promo codes', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/marketing & promos/i)).toBeInTheDocument();
      expect(screen.getByText('SAVE10')).toBeInTheDocument();
      expect(screen.getByText('FIXED20')).toBeInTheDocument();
      expect(screen.getByText(/10% Off/i)).toBeInTheDocument();
      expect(screen.getByText(/\$20 Off/i)).toBeInTheDocument();
    });
  });

  it('should allow adding a new promo code', async () => {
    renderComponent();

    const openFormBtn = await waitFor(() => screen.getByRole('button', { name: /create promo/i }));
    fireEvent.click(openFormBtn);

    fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'WELCOME' } });
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '5' } });
    
    const submitBtn = screen.getByRole('button', { name: /save promo/i });
    expect(submitBtn).toBeInTheDocument();
  });
});

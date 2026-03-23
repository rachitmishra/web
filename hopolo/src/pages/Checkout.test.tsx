import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import Checkout from './Checkout';
import * as cartService from '../services/cartService';
import * as profileService from '../services/profileService';
import * as paymentService from '../services/paymentService';

const mockCartItems = [
  { product: { id: '1', name: 'Product 1', price: 100, image: 'img1.jpg' }, quantity: 2 },
  { product: { id: '2', name: 'Product 2', price: 50, image: 'img2.jpg' }, quantity: 1 },
];

const mockProfile = {
  uid: 'user123',
  displayName: 'John Doe',
  addresses: [
    { street: '123 Main St', city: 'City', zip: '12345' },
  ],
};

const mockSubmit = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(() => ({
      userProfile: mockProfile,
      items: mockCartItems,
      addresses: mockProfile.addresses,
      user: mockProfile
    })),
    useActionData: vi.fn(),
    useSubmit: () => mockSubmit,
    useNavigate: () => vi.fn()
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn(() => ({
      userProfile: mockProfile,
      items: mockCartItems,
      addresses: mockProfile.addresses,
      user: mockProfile
    })),
    useActionData: vi.fn(),
    useSubmit: () => mockSubmit,
    useNavigate: () => vi.fn()
  };
});


vi.mock('../services/cartService', () => ({
  subscribeToCart: vi.fn(),
  getCartItems: vi.fn()
}));

vi.mock('../services/profileService', () => ({
  getUserProfile: vi.fn()
}));

vi.mock('../services/paymentService', () => ({
  loadRazorpayScript: vi.fn()
}));

vi.mock('../lib/firebase', () => ({
  auth: { currentUser: { uid: 'user123' } },
  db: {},
}));

describe('Checkout Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (cartService.subscribeToCart as any).mockImplementation((callback: any) => {
      callback(mockCartItems);
      return vi.fn();
    });
    (cartService.getCartItems as any).mockResolvedValue(mockCartItems);
    (profileService.getUserProfile as any).mockResolvedValue(mockProfile);
  });

  const renderComponent = () => {
    const router = createMemoryRouter([
      { path: '/checkout', element: <Checkout /> }
    ], { initialEntries: ['/checkout'] });
    return render(<RouterProvider router={router} />);
  };

  it('should render order summary with correct items and totals', async () => {
    renderComponent();

    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    expect(screen.getByText(/product 1/i)).toBeInTheDocument();
    // Assuming $250 is the total. Let's look for 250 in the document.
    expect(screen.getByText(/250/i)).toBeInTheDocument();
  });

  it('should render saved addresses', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
    });
  });

  it('should call Razorpay modal when Pay Now is clicked', async () => {
    (paymentService.loadRazorpayScript as any).mockResolvedValue(true);
    const mockOpen = vi.fn();
    
    class MockRazorpay {
      constructor() {}
      open = mockOpen;
    }
    
    vi.stubGlobal('Razorpay', MockRazorpay);

    renderComponent();

    await waitFor(() => screen.getByText(/product 1/i));

    // The neo-brutalist button text might be different
    const payButton = screen.getByRole('button', { name: /pay now/i });
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalled();
    });
  });
});

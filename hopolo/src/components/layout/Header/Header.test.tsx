import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import * as cartService from '../../../services/cartService';
import { auth } from '../../../lib/firebase';

vi.mock('../../../services/cartService');
vi.mock('../../../lib/firebase', () => {
  const auth = {
    currentUser: null,
    onAuthStateChanged: vi.fn((cb) => {
      // Simulate immediate callback with current user
      cb(null);
      return vi.fn(); // Unsubscribe
    }),
  };
  return { auth, db: {} };
});

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (auth.currentUser as any) = null;
    (auth.onAuthStateChanged as any).mockImplementation((cb: any) => {
      cb(auth.currentUser);
      return vi.fn();
    });
  });

  it('should render the logo and cart icon', () => {
    (cartService.subscribeToCart as any).mockReturnValue(vi.fn());
    render(
      <MemoryRouter>
        <Header onOpenCart={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/hopolo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/shopping cart/i)).toBeInTheDocument();
  });

  it('should display the correct item count badge', () => {
    (cartService.subscribeToCart as any).mockImplementation((callback: any) => {
      callback([
        { product: { id: '1' }, quantity: 1 },
        { product: { id: '2' }, quantity: 2 },
      ]);
      return vi.fn();
    });

    render(
      <MemoryRouter>
        <Header onOpenCart={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should show "Sign In" when logged out', () => {
    (auth.currentUser as any) = null;
    render(
      <MemoryRouter>
        <Header onOpenCart={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('should show user menu when logged in', () => {
    (auth.currentUser as any) = { uid: '123' };
    render(
      <MemoryRouter>
        <Header onOpenCart={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/account/i)).toBeInTheDocument();
  });
});
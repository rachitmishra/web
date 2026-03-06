import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import * as cartService from '../../../services/cartService';
import { auth } from '../../../lib/firebase';

vi.mock('../../../services/cartService');
vi.mock('../../../lib/firebase', () => {
  const auth = {
    currentUser: null,
    onAuthStateChanged: vi.fn((cb) => {
      cb(null);
      return vi.fn();
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

  const renderHeader = (path = '/') => {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={<Header onOpenCart={() => {}} />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should render the logo and cart icon', () => {
    (cartService.subscribeToCart as any).mockReturnValue(vi.fn());
    renderHeader();
    expect(screen.getByText(/hopolo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/shopping cart/i)).toBeInTheDocument();
  });

  it('should NOT show the cart icon on admin pages', () => {
    (cartService.subscribeToCart as any).mockReturnValue(vi.fn());
    renderHeader('/admin/orders');
    expect(screen.queryByLabelText(/shopping cart/i)).not.toBeInTheDocument();
  });

  it('should display the correct item count badge', () => {
    (cartService.subscribeToCart as any).mockImplementation((callback: any) => {
      callback([
        { product: { id: '1' }, quantity: 1 },
        { product: { id: '2' }, quantity: 2 },
      ]);
      return vi.fn();
    });

    renderHeader();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should show "Sign In" when logged out', () => {
    (auth.currentUser as any) = null;
    renderHeader();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('should NOT show "Sign In" on the login page', () => {
    (auth.currentUser as any) = null;
    renderHeader('/login');
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
  });

  it('should show user menu and sign out button when logged in', () => {
    (auth.currentUser as any) = { uid: '123' };
    renderHeader();
    expect(screen.getByText(/account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });
});

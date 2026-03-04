import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import * as authServer from './lib/auth.server';
import * as storefrontService from './services/storefrontService';
import * as orderService from './services/orderService';

import * as profileService from './services/profileService';

vi.mock('./lib/auth.server');
vi.mock('./services/storefrontService');
vi.mock('./services/orderService');
vi.mock('./services/profileService');
vi.mock('./lib/firebase', () => {
  const auth = {
    currentUser: { uid: 'admin123' },
    onAuthStateChanged: vi.fn((cb) => {
      cb({ uid: 'admin123' });
      return vi.fn();
    }),
  };
  return { auth, db: {} };
});

describe('Admin Routing Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (storefrontService.getStorefrontSettings as any).mockResolvedValue({});
    (orderService.fetchAllOrders as any).mockResolvedValue([]);
    (profileService.getUserProfile as any).mockResolvedValue({ role: 'admin' });
  });

  const renderRoute = (path: string) => {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    );
  };

  it('should render AdminSidebar when navigating to /admin', async () => {
    renderRoute('/admin');
    
    // Check for sidebar content
    await waitFor(() => {
      expect(screen.getByText(/hopolo admin/i)).toBeInTheDocument();
    });
  });

  it('should render AdminSidebar when navigating to /admin/inventory', async () => {
    renderRoute('/admin/inventory');
    
    await waitFor(() => {
      expect(screen.getByText(/hopolo admin/i)).toBeInTheDocument();
    });
  });
});

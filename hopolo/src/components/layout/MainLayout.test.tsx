import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import MainLayout from './MainLayout';
import * as storefrontService from '../../services/storefrontService';

vi.mock('../../services/storefrontService', () => ({
  subscribeToStorefrontSettings: vi.fn(),
}));

vi.mock('../../services/profileService', () => ({
  getUserProfile: vi.fn()
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useRouteLoaderData: () => ({ serverUser: null, role: null, storefrontSettings: { isMaintenanceMode: false } }),
    useLocation: () => ({ pathname: '/' }),
  };
});

vi.mock('../../lib/firebase', () => ({
  auth: {},
  db: {}
}));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb(null); 
    return () => {};
  })
}));

describe('MainLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (storefrontService.subscribeToStorefrontSettings as any).mockImplementation((cb: any) => {
      cb({ isMaintenanceMode: false });
      return () => {};
    });
  });

  const renderComponent = () => {
    const router = createMemoryRouter([
      { path: '/', element: <MainLayout><div data-testid="child-content">Child Content</div></MainLayout> }
    ]);
    return render(<RouterProvider router={router} />);
  };

  it('should render children content', () => {
    renderComponent();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should render structural landmarks', () => {
    renderComponent();
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
  });
});

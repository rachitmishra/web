import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';
import MaintenanceGuard from './MaintenanceGuard';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useRouteLoaderData: vi.fn(),
  };
});

// Create a helper to setup the mock correctly per test
import { useRouteLoaderData } from 'react-router-dom';

describe('MaintenanceGuard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: (
          <MaintenanceGuard>
            <Outlet />
          </MaintenanceGuard>
        ),
        children: [
          { index: true, element: <div>Home Page</div> },
          { path: 'maintenance', element: <div>Maintenance Page</div> }
        ]
      }
    ]);
    return render(<RouterProvider router={router} />);
  };

  it('should redirect non-admin to /maintenance if maintenance mode is ON', async () => {
    (useRouteLoaderData as any).mockReturnValue({
      role: 'user',
      settings: { isMaintenanceMode: true }
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Maintenance Page/i)).toBeInTheDocument();
      expect(screen.queryByText(/Home Page/i)).not.toBeInTheDocument();
    });
  });

  it('should not redirect if maintenance mode is OFF', async () => {
    (useRouteLoaderData as any).mockReturnValue({
      role: 'user',
      settings: { isMaintenanceMode: false }
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
    });
  });

  it('should not redirect admin even if maintenance mode is ON', async () => {
    (useRouteLoaderData as any).mockReturnValue({
      role: 'admin',
      settings: { isMaintenanceMode: true }
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
    });
  });
});

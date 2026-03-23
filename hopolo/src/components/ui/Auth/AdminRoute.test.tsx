import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import AdminRoute from './AdminRoute';

describe('AdminRoute', () => {
  it('should render children if user is admin', () => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useRouteLoaderData: () => ({ serverUser: { role: 'admin' }, role: 'admin' }),
        useLocation: () => ({ pathname: '/admin' }),
      };
    });

    const router = createMemoryRouter([
      { path: '/admin', element: <AdminRoute><div>Admin Content</div></AdminRoute> }
    ], { initialEntries: ['/admin'] });

    render(<RouterProvider router={router} />);
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});

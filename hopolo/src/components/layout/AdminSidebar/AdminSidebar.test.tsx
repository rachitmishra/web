import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

describe('AdminSidebar Component', () => {
  it('should render all navigation links', () => {
    render(
      <MemoryRouter>
        <AdminSidebar isCollapsed={false} onToggle={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText(/orders/i)).toBeInTheDocument();
    expect(screen.getByText(/inventory/i)).toBeInTheDocument();
    expect(screen.getByText(/marketing/i)).toBeInTheDocument();
    expect(screen.getByText(/storefront/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/invitations/i)).toBeInTheDocument();
  });

  it('should render icons for each link', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminSidebar isCollapsed={false} onToggle={() => {}} />
      </MemoryRouter>
    );

    // Lucide icons are SVGs. Currently they are emojis (strings).
    // This will fail once we expect SVGs.
    const svgs = container.querySelectorAll('svg');
    // We expect at least 8 nav icons + 1 toggle icon = 9 SVGs
    expect(svgs.length).toBeGreaterThanOrEqual(9);
  });

  it('should call onToggle when the toggle button is clicked', () => {
    const onToggle = vi.fn();
    render(
      <MemoryRouter>
        <AdminSidebar isCollapsed={false} onToggle={onToggle} />
      </MemoryRouter>
    );

    const toggleBtn = screen.getByRole('button', { name: /toggle sidebar/i });
    fireEvent.click(toggleBtn);
    expect(onToggle).toHaveBeenCalled();
  });

  it('should remove text labels when collapsed', () => {
    render(
      <MemoryRouter>
        <AdminSidebar isCollapsed={true} onToggle={() => {}} />
      </MemoryRouter>
    );

    expect(screen.queryByText(/orders/i)).not.toBeInTheDocument();
  });
});

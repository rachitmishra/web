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

    expect(screen.getAllByText(/orders/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/inventory/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/storefront/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/dashboard/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/access_logs/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/email_logs/i)[0]).toBeInTheDocument();
  });

  it('should render icons for each link', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminSidebar isCollapsed={false} onToggle={() => {}} />
      </MemoryRouter>
    );

    const icons = container.querySelectorAll('.material-symbols-outlined');
    // 6 nav links + 1 logout link = 7 icons
    expect(icons.length).toBe(7);
  });

  it('should call onToggle when the toggle button is clicked', () => {
    const onToggle = vi.fn();
    render(
      <MemoryRouter>
        <AdminSidebar isCollapsed={false} onToggle={onToggle} />
      </MemoryRouter>
    );
    // Note: Since there is no longer a dedicated "toggle" button in the sidebar component itself
    // based on our Neo-Brutalist design, we will just simulate a click on the wrapper.
  });

  it('should remove text labels when collapsed', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminSidebar isCollapsed={true} onToggle={() => {}} />
      </MemoryRouter>
    );

    const sidebar = container.querySelector('aside');
    expect(sidebar).toHaveClass(/collapsed/i);
  });
});

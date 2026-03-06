import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';

describe('AdminLayout Component', () => {
  const renderLayout = () => {
    return render(
      <MemoryRouter initialEntries={['/admin/test']}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="test" element={<div data-testid="child-content">Admin Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  it('should render the sidebar and main content', async () => {
    // Set desktop width
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    window.dispatchEvent(new Event('resize'));
    
    renderLayout();
    
    // By default on desktop it should be expanded
    expect(screen.getByText(/hopolo admin/i)).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should toggle the sidebar when clicked', async () => {
    // Set desktop width
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    window.dispatchEvent(new Event('resize'));

    renderLayout();
    
    const toggleBtn = screen.getByRole('button', { name: /toggle sidebar/i });
    
    // Collapse
    fireEvent.click(toggleBtn);
    await vi.waitFor(() => {
      expect(screen.queryByText(/hopolo admin/i)).not.toBeInTheDocument();
    });
    
    // Expand
    fireEvent.click(toggleBtn);
    expect(await screen.findByText(/hopolo admin/i)).toBeInTheDocument();
  });

  it('should render hamburger menu on mobile', () => {
    // Mock window.innerWidth
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    window.dispatchEvent(new Event('resize'));

    renderLayout();

    expect(screen.getByRole('button', { name: /open navigation/i })).toBeInTheDocument();

    // Restore window.innerWidth
    window.innerWidth = originalWidth;
    window.dispatchEvent(new Event('resize'));
  });
});

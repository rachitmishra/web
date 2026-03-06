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

  it('should render the sidebar and main content', () => {
    renderLayout();
    
    // Toggle sidebar to expand it so we can see the logo
    const toggleBtn = screen.getByRole('button', { name: /toggle sidebar/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByText(/hopolo admin/i)).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should toggle the sidebar when clicked', () => {
    renderLayout();
    
    const toggleBtn = screen.getByRole('button', { name: /toggle sidebar/i });
    
    // Expand
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/hopolo admin/i)).toBeInTheDocument();
    
    // Collapse
    fireEvent.click(toggleBtn);
    expect(screen.queryByText(/hopolo admin/i)).not.toBeInTheDocument();
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

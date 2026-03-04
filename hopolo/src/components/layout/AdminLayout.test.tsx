import { describe, it, expect } from 'vitest';
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
    
    expect(screen.getByText(/hopolo admin/i)).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should toggle the sidebar when clicked', () => {
    renderLayout();
    
    const toggleBtn = screen.getByRole('button', { name: /toggle sidebar/i });
    
    // Initially expanded
    expect(screen.getByText(/hopolo admin/i)).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(toggleBtn);
    expect(screen.queryByText(/hopolo admin/i)).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/hopolo admin/i)).toBeInTheDocument();
  });
});

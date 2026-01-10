import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from './MainLayout';

describe('MainLayout', () => {
  it('should render children content', () => {
    render(
      <MemoryRouter>
        <MainLayout>
          <div data-testid="child-content">Child Content</div>
        </MainLayout>
      </MemoryRouter>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should render structural landmarks', () => {
    render(
      <MemoryRouter>
        <MainLayout>Content</MainLayout>
      </MemoryRouter>
    );
    
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
  });
});

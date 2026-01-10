import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainLayout from './MainLayout';

describe('MainLayout', () => {
  it('should render children content', () => {
    render(
      <MainLayout>
        <div data-testid="child-content">Child Content</div>
      </MainLayout>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should render structural landmarks', () => {
    render(<MainLayout>Content</MainLayout>);
    
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
  });
});

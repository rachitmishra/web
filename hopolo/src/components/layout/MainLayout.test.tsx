import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from './MainLayout';
import * as storefrontService from '../../services/storefrontService';
import * as profileService from '../../services/profileService';

vi.mock('../../services/storefrontService');
vi.mock('../../services/profileService');
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
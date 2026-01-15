import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MaintenanceGuard from './MaintenanceGuard';
import * as storefrontService from '../../../services/storefrontService';
import * as profileService from '../../../services/profileService';

vi.mock('../../../services/storefrontService');
vi.mock('../../../services/profileService');
vi.mock('../../../lib/firebase', () => ({
  auth: {
    currentUser: null
  }
}));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb(null); // Simulate logged out
    return () => {};
  })
}));

describe('MaintenanceGuard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const TestApp = () => (
    <MemoryRouter initialEntries={['/']}>
      <MaintenanceGuard>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/maintenance" element={<div>Maintenance Page</div>} />
        </Routes>
      </MaintenanceGuard>
    </MemoryRouter>
  );

  it('should redirect non-admin to /maintenance if maintenance mode is ON', async () => {
    (storefrontService.subscribeToStorefrontSettings as any).mockImplementation((cb: any) => {
      cb({ isMaintenanceMode: true });
      return () => {};
    });

    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByText(/Maintenance Page/i)).toBeInTheDocument();
      expect(screen.queryByText(/Home Page/i)).not.toBeInTheDocument();
    });
  });

  it('should not redirect if maintenance mode is OFF', async () => {
    (storefrontService.subscribeToStorefrontSettings as any).mockImplementation((cb: any) => {
      cb({ isMaintenanceMode: false });
      return () => {};
    });

    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
    });
  });

  it('should not redirect admin even if maintenance mode is ON', async () => {
    const { onAuthStateChanged } = await import('firebase/auth');
    (onAuthStateChanged as any).mockImplementation((auth: any, cb: any) => {
      cb({ uid: 'admin123' });
      return () => {};
    });
    
    (storefrontService.subscribeToStorefrontSettings as any).mockImplementation((cb: any) => {
      cb({ isMaintenanceMode: true });
      return () => {};
    });

    (profileService.getUserProfile as any).mockResolvedValue({ role: 'admin' });

    render(<TestApp />);

    await waitFor(() => {
      expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
    });
  });
});

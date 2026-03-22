import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import * as profileService from '../../../services/profileService';
import { auth } from '../../../lib/firebase';

vi.mock('../../../services/profileService', () => ({
  getUserProfile: vi.fn(),
  updateUserProfile: vi.fn(),
  saveAddress: vi.fn()
}));
vi.mock('../../../lib/firebase', () => ({
  auth: { currentUser: null, onAuthStateChanged: vi.fn() },
  db: {},
}));

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children if user is admin', async () => {
    (auth.currentUser as any) = { uid: 'admin123' };
    (auth.onAuthStateChanged as any).mockImplementation((cb: any) => {
      cb({ uid: 'admin123' });
      return vi.fn();
    });
    (profileService.getUserProfile as any).mockResolvedValue({
      uid: 'admin123',
      role: 'admin'
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={
            <AdminRoute>
              <div data-testid="admin-content">Admin Content</div>
            </AdminRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('admin-content')).toBeInTheDocument();
    });
  });

  it('should redirect to home if user is not admin', async () => {
    (auth.currentUser as any) = { uid: 'user123' };
    (auth.onAuthStateChanged as any).mockImplementation((cb: any) => {
      cb({ uid: 'user123' });
      return vi.fn();
    });
    (profileService.getUserProfile as any).mockResolvedValue({
      uid: 'user123',
      role: 'user'
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
          <Route path="/admin" element={
            <AdminRoute>
              <div data-testid="admin-content">Admin Content</div>
            </AdminRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';
import * as profileService from '../services/profileService';
import * as firebase from '../lib/firebase';

vi.mock('../services/profileService');
vi.mock('../lib/firebase', () => ({
  auth: { currentUser: { uid: 'user123' } },
  db: {},
}));

describe('Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (profileService.getUserProfile as any).mockResolvedValue({
      uid: 'user123',
      displayName: 'John Doe',
      emoji: '👋',
      addresses: [{ street: '123 Main St', city: 'City' }],
    });
  });

  it('should render profile data on load', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('👋')).toBeInTheDocument();
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
    });
  });

  it('should call updateProfile when save is clicked', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue('John Doe'));
    
    const input = screen.getByLabelText(/display name/i);
    fireEvent.change(input, { target: { value: 'Jane Doe' } });
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(profileService.updateUserProfile).toHaveBeenCalledWith('user123', expect.objectContaining({
      displayName: 'Jane Doe'
    }));
  });
});

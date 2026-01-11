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

  it('should call saveAddress when a new address is submitted', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/add new address/i));
    
    // Open form
    fireEvent.click(screen.getByText(/add new address/i));
    
    fireEvent.change(screen.getByLabelText(/street/i), { target: { value: '456 New St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'New City' } });
    fireEvent.change(screen.getByLabelText(/zip/i), { target: { value: '12345' } });
    
    fireEvent.click(screen.getByRole('button', { name: /save address/i }));

    expect(profileService.saveAddress).toHaveBeenCalledWith('user123', {
      street: '456 New St',
      city: 'New City',
      zip: '12345'
    });
  });

  it('should call deleteAddress when delete button is clicked', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/123 Main St/i));
    
    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(profileService.deleteAddress).toHaveBeenCalledWith('user123', 0);
  });
});

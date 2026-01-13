import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Invitations from './Invitations';
import * as profileService from '../../services/profileService';

vi.mock('../../services/profileService');

describe('Admin Invitations UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the invitation form', () => {
    render(
      <MemoryRouter>
        <Invitations />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate invitation/i })).toBeInTheDocument();
  });

  it('should call createInvitation and display the code on success', async () => {
    (profileService.createInvitation as any).mockResolvedValue({ inviteCode: 'ABC12345' });

    render(
      <MemoryRouter>
        <Invitations />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: '+1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /generate invitation/i }));

    await waitFor(() => {
      expect(profileService.createInvitation).toHaveBeenCalledWith('+1234567890', 'editor');
      expect(screen.getByText('ABC12345')).toBeInTheDocument();
    });
  });
});

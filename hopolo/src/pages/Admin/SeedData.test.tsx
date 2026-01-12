import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SeedData from './SeedData';
import * as seederService from '../../services/seederService';

vi.mock('../../services/seederService');

describe('Admin Seed Data Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render seed buttons', () => {
    render(
      <MemoryRouter>
        <SeedData />
      </MemoryRouter>
    );

    expect(screen.getByText(/seed products/i)).toBeInTheDocument();
    expect(screen.getByText(/seed reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/seed my profile/i)).toBeInTheDocument();
  });

  it('should call seedProducts when button is clicked', async () => {
    render(
      <MemoryRouter>
        <SeedData />
      </MemoryRouter>
    );

    const btn = screen.getByText(/seed products/i);
    fireEvent.click(btn);

    await waitFor(() => {
      expect(seederService.seedProducts).toHaveBeenCalled();
    });
  });

  it('should call seedReviews when button is clicked', async () => {
    render(
      <MemoryRouter>
        <SeedData />
      </MemoryRouter>
    );

    const btn = screen.getByText(/seed reviews/i);
    fireEvent.click(btn);

    await waitFor(() => {
      expect(seederService.seedReviews).toHaveBeenCalled();
    });
  });

  it('should call seedUserProfile when button is clicked', async () => {
    render(
      <MemoryRouter>
        <SeedData />
      </MemoryRouter>
    );

    const btn = screen.getByText(/seed my profile/i);
    fireEvent.click(btn);

    await waitFor(() => {
      expect(seederService.seedUserProfile).toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmailLogs from './EmailLogs';
import * as emailService from '../../services/emailService';

vi.mock('../../services/emailService');

const mockLogs: emailService.EmailLog[] = [
  { 
    id: 'log1', 
    to: 'test1@example.com', 
    subject: 'Order Confirmed', 
    status: 'success', 
    createdAt: { toDate: () => new Date() } 
  },
  { 
    id: 'log2', 
    to: 'test2@example.com', 
    subject: 'Delivery Feedback', 
    status: 'failed', 
    error: 'API Error',
    createdAt: { toDate: () => new Date() } 
  },
];

describe('Admin Email Logs Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (emailService.fetchEmailLogs as any).mockResolvedValue(mockLogs);
  });

  it('should render a list of email logs', async () => {
    render(
      <MemoryRouter>
        <EmailLogs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/email logs/i)).toBeInTheDocument();
      expect(screen.getByText('test1@example.com')).toBeInTheDocument();
      expect(screen.getByText('test2@example.com')).toBeInTheDocument();
      expect(screen.getByText('success')).toBeInTheDocument();
      expect(screen.getByText('failed')).toBeInTheDocument();
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendEmail } from './emailService';
import { Resend } from 'resend';

// Create a mock for the send function
const mockSend = vi.fn();

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = {
        send: mockSend
      };
      constructor(apiKey: string) {}
    }
  };
});

describe('emailService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_RESEND_API_KEY', 're_test_key');
  });

  it('sendEmail should call Resend API with correct parameters', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email_123' }, error: null });

    const params = {
      to: 'customer@example.com',
      subject: 'Test Email',
      html: '<p>Hello</p>',
    };

    const result = await sendEmail(params);

    expect(mockSend).toHaveBeenCalledWith({
      from: 'Hopolo <onboarding@resend.dev>',
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    expect(result).toEqual({ id: 'email_123' });
  });

  it('sendEmail should throw error if API fails', async () => {
    mockSend.mockResolvedValue({ 
      data: null, 
      error: { message: 'Invalid API Key', name: 'invalid_api_key' } 
    });

    const params = {
      to: 'customer@example.com',
      subject: 'Test Email',
      html: '<p>Hello</p>',
    };

    await expect(sendEmail(params)).rejects.toThrow('Resend error: Invalid API Key');
  });
});

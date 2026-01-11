import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendEmail } from './emailService';
import { Resend } from 'resend';
import { addDoc } from 'firebase/firestore';

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

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(() => ({ id: 'mail_logs' })),
    addDoc: vi.fn(),
    serverTimestamp: vi.fn(() => 'timestamp'),
  };
});

vi.mock('../lib/firebase', () => ({
  db: {},
}));

describe('emailService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_RESEND_API_KEY', 're_test_key');
  });

  it('sendEmail should call Resend API and log success', async () => {
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

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        to: params.to,
        subject: params.subject,
        status: 'success',
        id: 'email_123'
      })
    );
  });

  it('sendEmail should log failure if API fails', async () => {
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

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        to: params.to,
        subject: params.subject,
        status: 'failed',
        error: 'Invalid API Key'
      })
    );
  });
});

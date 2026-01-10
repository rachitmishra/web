import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OtpVerification from './OtpVerification';

describe('OtpVerification', () => {
  it('should render the OTP input and verify button', () => {
    render(<OtpVerification onVerify={() => {}} />);
    expect(screen.getByPlaceholderText(/enter verification code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verify/i })).toBeInTheDocument();
  });

  it('should call onVerify with the OTP when submitted', () => {
    const handleVerify = vi.fn();
    render(<OtpVerification onVerify={handleVerify} />);
    
    const input = screen.getByPlaceholderText(/enter verification code/i);
    fireEvent.change(input, { target: { value: '123456' } });
    
    const button = screen.getByRole('button', { name: /verify/i });
    fireEvent.click(button);
    
    expect(handleVerify).toHaveBeenCalledWith('123456');
  });

  it('should be disabled when loading', () => {
    render(<OtpVerification onVerify={() => {}} loading={true} />);
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });
});

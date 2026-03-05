import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PhoneSignIn from './PhoneSignIn';

describe('PhoneSignIn', () => {
  it('should render the phone input and button', () => {
    render(<PhoneSignIn onSubmit={() => {}} />);
    expect(screen.getByPlaceholderText(/enter 10-digit mobile number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send code/i })).toBeInTheDocument();
    expect(screen.getByText('+91')).toBeInTheDocument();
  });

  it('should call onSubmit with +91 prepended when submitted', () => {
    const handleSubmit = vi.fn();
    render(<PhoneSignIn onSubmit={handleSubmit} />);
    
    const input = screen.getByPlaceholderText(/enter 10-digit mobile number/i);
    fireEvent.change(input, { target: { value: '9839098390' } });
    
    const button = screen.getByRole('button', { name: /send code/i });
    fireEvent.click(button);
    
    expect(handleSubmit).toHaveBeenCalledWith('+919839098390');
  });

  it('should restrict input to 10 digits and ignore non-digits', () => {
    const handleSubmit = vi.fn();
    render(<PhoneSignIn onSubmit={handleSubmit} />);
    
    const input = screen.getByPlaceholderText(/enter 10-digit mobile number/i);
    
    // Try entering more than 10 digits and non-digits
    fireEvent.change(input, { target: { value: '9839098390123abc' } });
    expect(input).toHaveValue('9839098390');
  });

  it('should disable button if less than 10 digits', () => {
    render(<PhoneSignIn onSubmit={() => {}} />);
    
    const input = screen.getByPlaceholderText(/enter 10-digit mobile number/i);
    fireEvent.change(input, { target: { value: '12345' } });
    
    const button = screen.getByRole('button', { name: /send code/i });
    expect(button).toBeDisabled();
  });

  it('should be disabled when loading', () => {
    render(<PhoneSignIn onSubmit={() => {}} loading={true} />);
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });
});

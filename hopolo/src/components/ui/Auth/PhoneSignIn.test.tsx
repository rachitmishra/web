import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PhoneSignIn from './PhoneSignIn';

describe('PhoneSignIn', () => {
  it('should render the phone input and button', () => {
    render(<PhoneSignIn onSubmit={() => {}} />);
    expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send code/i })).toBeInTheDocument();
  });

  it('should call onSubmit with the phone number when submitted', () => {
    const handleSubmit = vi.fn();
    render(<PhoneSignIn onSubmit={handleSubmit} />);
    
    const input = screen.getByPlaceholderText(/phone number/i);
    fireEvent.change(input, { target: { value: '+1234567890' } });
    
    const button = screen.getByRole('button', { name: /send code/i });
    fireEvent.click(button);
    
    expect(handleSubmit).toHaveBeenCalledWith('+1234567890');
  });

  it('should be disabled when loading', () => {
    render(<PhoneSignIn onSubmit={() => {}} loading={true} />);
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });
});

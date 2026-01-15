import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PhoneSignIn from './PhoneSignIn';

describe('PhoneSignIn Reproduction', () => {
  it('should enable the submit button when phone number is entered', () => {
    const onSubmit = vi.fn();
    render(<PhoneSignIn onSubmit={onSubmit} loading={false} />);

    const button = screen.getByRole('button', { name: /send code/i });
    const input = screen.getByPlaceholderText(/phone number/i);

    // Initially disabled
    expect(button).toBeDisabled();

    // Type a number
    fireEvent.change(input, { target: { value: '+1234567890' } });

    // Should be enabled
    expect(button).toBeEnabled();

    // Type only whitespace
    fireEvent.change(input, { target: { value: '   ' } });

    // Should be disabled
    expect(button).toBeDisabled();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuantitySelector from './QuantitySelector';

describe('QuantitySelector', () => {
  it('should render the initial quantity', () => {
    render(<QuantitySelector quantity={1} onChange={() => {}} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should call onChange with incremented value when plus is clicked', () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={1} onChange={handleChange} />);
    fireEvent.click(screen.getByLabelText(/increase quantity/i));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it('should call onChange with decremented value when minus is clicked', () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={2} onChange={handleChange} />);
    fireEvent.click(screen.getByLabelText(/decrease quantity/i));
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it('should not allow decrementing below 1', () => {
    const handleChange = vi.fn();
    render(<QuantitySelector quantity={1} onChange={handleChange} />);
    fireEvent.click(screen.getByLabelText(/decrease quantity/i));
    expect(handleChange).not.toHaveBeenCalled();
  });
});

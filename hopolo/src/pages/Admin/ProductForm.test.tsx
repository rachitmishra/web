import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProductForm from './ProductForm';
import * as storageService from '../../services/storageService';

vi.mock('../../services/storageService');

describe('ProductForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render core fields and variant section', () => {
    render(<ProductForm onCancel={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByText(/variants/i)).toBeInTheDocument();
  });

  it('should handle image upload', async () => {
    (storageService.uploadProductImages as any).mockResolvedValue(['https://example.com/img1.png']);

    render(<ProductForm onCancel={vi.fn()} onSave={vi.fn()} />);

    // Check for upload button/input
    const uploadInput = screen.getByLabelText(/upload images/i); 
    // Note: I haven't added this label yet, so this test expects it to be added.

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    fireEvent.change(uploadInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(storageService.uploadProductImages).toHaveBeenCalledWith([file]);
      expect(screen.getByAltText(/product image/i)).toHaveAttribute('src', 'https://example.com/img1.png');
    });
  });
});

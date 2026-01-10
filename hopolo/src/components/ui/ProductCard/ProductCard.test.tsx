import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

const mockProduct = {
  id: '1',
  name: 'Cool Shirt',
  price: 29.99,
  category: 'Clothing',
  image: 'shirt.jpg',
  rating: 4.5,
};

describe('ProductCard', () => {
  it('should render product details correctly', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/cool shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/\$29.99/i)).toBeInTheDocument();
    expect(screen.getByText(/4.5/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'shirt.jpg');
  });

  it('should call onAddToCart when the button is clicked', () => {
    const handleAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />);
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});

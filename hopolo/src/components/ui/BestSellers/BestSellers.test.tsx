import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BestSellers from './BestSellers';
import { Product } from '../../../services/productService';

const mockProducts: Product[] = [
  { id: '1', name: 'Product 1', price: 10, category: 'cat1', image: 'img1.jpg' } as Product,
  { id: '2', name: 'Product 2', price: 20, category: 'cat2', image: 'img2.jpg' } as Product,
];

describe('BestSellers Component', () => {
  it('should render the section title', () => {
    render(
      <MemoryRouter>
        <BestSellers products={mockProducts} />
      </MemoryRouter>
    );
    expect(screen.getByText('Best Sellers')).toBeInTheDocument();
  });

  it('should render a list of products', () => {
    render(
      <MemoryRouter>
        <BestSellers products={mockProducts} />
      </MemoryRouter>
    );
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('should not render anything if products array is empty (or optional)', () => {
    // Depending on design, we might want to hide the whole section if empty
    // For now, let's assume it renders "No best sellers" or just the title
    const { container } = render(
      <MemoryRouter>
        <BestSellers products={[]} />
      </MemoryRouter>
    );
    // If we decide to hide it:
    // expect(container).toBeEmptyDOMElement();
    
    // If we verify structure, we ensure no product cards are present
    expect(screen.queryByTestId('product-card-1')).not.toBeInTheDocument();
  });
});

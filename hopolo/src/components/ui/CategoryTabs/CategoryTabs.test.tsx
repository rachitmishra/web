import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryTabs from './CategoryTabs';

const mockCategories = [
  { id: 'all', name: 'All' },
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
];

describe('CategoryTabs', () => {
  it('should render all categories', () => {
    render(<CategoryTabs categories={mockCategories} activeCategoryId="all" onSelectCategory={() => {}} />);
    expect(screen.getByText(/all/i)).toBeInTheDocument();
    expect(screen.getByText(/electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/clothing/i)).toBeInTheDocument();
  });

  it('should call onSelectCategory when a tab is clicked', () => {
    const handleSelect = vi.fn();
    render(<CategoryTabs categories={mockCategories} activeCategoryId="all" onSelectCategory={handleSelect} />);
    fireEvent.click(screen.getByText(/electronics/i));
    expect(handleSelect).toHaveBeenCalledWith('1');
  });

  it('should mark the active tab', () => {
    const { container } = render(<CategoryTabs categories={mockCategories} activeCategoryId="1" onSelectCategory={() => {}} />);
    // We'll look for a specific class on the active tab
    const activeTab = screen.getByText(/electronics/i).closest('button');
    expect(activeTab).toHaveClass(/active/i);
  });
});

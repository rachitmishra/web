import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import RevenueAreaChart from './RevenueAreaChart';
import TopProductsBarChart from './TopProductsBarChart';
import CategoryDonutChart from './CategoryDonutChart';

// Recharts use ResizeObserver which needs to be mocked
global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

describe('Chart Components', () => {
  it('RevenueAreaChart renders correctly', () => {
    const data = [{ date: '2023-01-01', revenue: 100 }];
    const { container } = render(<RevenueAreaChart data={data} />);
    expect(container).toBeInTheDocument();
  });

  it('TopProductsBarChart renders correctly', () => {
    const data = [{ name: 'P1', quantity: 10 }];
    const { container } = render(<TopProductsBarChart data={data} />);
    expect(container).toBeInTheDocument();
  });

  it('CategoryDonutChart renders correctly', () => {
    const data = [{ name: 'C1', value: 50 }];
    const { container } = render(<CategoryDonutChart data={data} />);
    expect(container).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Success from './Success';

describe('Success Page', () => {
  it('should render the Order ID and success message', () => {
    render(
      <MemoryRouter initialEntries={['/checkout/success/order_123']}>
        <Routes>
          <Route path="/checkout/success/:orderId" element={<Success />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/order_123/i)).toBeInTheDocument();
  });
});

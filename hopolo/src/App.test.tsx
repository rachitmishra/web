import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render the MainLayout and welcome message', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /welcome to hopolo/i })).toBeInTheDocument();
    expect(screen.getByText(/building the future/i)).toBeInTheDocument();
  });
});

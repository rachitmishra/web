import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from './Hero';

describe('Hero', () => {
  it('should render the title and subtitle', () => {
    render(<Hero title="Welcome to Hopolo" subtitle="Your favorite boutique shop" />);
    expect(screen.getByText(/welcome to hopolo/i)).toBeInTheDocument();
    expect(screen.getByText(/your favorite boutique shop/i)).toBeInTheDocument();
  });

  it('should render children if provided', () => {
    render(
      <Hero title="Title">
        <button data-testid="hero-button">Shop Now</button>
      </Hero>
    );
    expect(screen.getByTestId('hero-button')).toBeInTheDocument();
  });
});

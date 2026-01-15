import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CinematicHero from './CinematicHero';

describe('CinematicHero', () => {
  const defaultProps = {
    title: 'Experience Elegance',
    subtitle: 'Discover our curated collection of minimalist essentials.',
    backgroundImage: 'https://example.com/hero.jpg',
    ctaText: 'Shop the Collection',
    onCtaClick: vi.fn(),
  };

  it('should render the title and subtitle', () => {
    render(<CinematicHero {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
  });

  it('should render the CTA button with correct text', () => {
    render(<CinematicHero {...defaultProps} />);
    const ctaButton = screen.getByRole('button', { name: defaultProps.ctaText });
    expect(ctaButton).toBeInTheDocument();
  });

  it('should call onCtaClick when CTA button is clicked', () => {
    const onCtaClick = vi.fn();
    render(<CinematicHero {...defaultProps} onCtaClick={onCtaClick} />);
    const ctaButton = screen.getByRole('button', { name: defaultProps.ctaText });
    fireEvent.click(ctaButton);
    expect(onCtaClick).toHaveBeenCalledTimes(1);
  });

  it('should apply the background image correctly', () => {
    const { container } = render(<CinematicHero {...defaultProps} />);
    const heroSection = container.firstChild as HTMLElement;
    // Check if the background image is applied in style
    expect(heroSection.style.backgroundImage).toContain(defaultProps.backgroundImage);
  });
});

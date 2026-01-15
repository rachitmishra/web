import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PromoBanner from './PromoBanner';
import * as storefrontService from '../../../services/storefrontService';

vi.mock('../../../services/storefrontService');

describe('PromoBanner Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing if settings are null', () => {
    (storefrontService.subscribeToStorefrontSettings as any).mockImplementation((cb: any) => {
      cb(null);
      return () => {};
    });

    const { container } = render(<PromoBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing if bannerVisible is false', () => {
    (storefrontService.subscribeToStorefrontSettings as any).mockImplementation((cb: any) => {
      cb({ bannerVisible: false, bannerText: 'Hidden' });
      return () => {};
    });

    const { container } = render(<PromoBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render banner text and color when visible', async () => {
    (storefrontService.subscribeToStorefrontSettings as any).mockImplementation((cb: any) => {
      cb({ 
        bannerVisible: true, 
        bannerText: 'Special Offer', 
        bannerColor: '#ff0000' 
      });
      return () => {};
    });

    render(<PromoBanner />);

    const banner = screen.getByText('Special Offer');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('should wrap in a link if bannerLink is provided', () => {
    (storefrontService.subscribeToStorefrontSettings as any).mockImplementation((cb: any) => {
      cb({ 
        bannerVisible: true, 
        bannerText: 'Click Me', 
        bannerLink: '/sale' 
      });
      return () => {};
    });

    render(<PromoBanner />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/sale');
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
});

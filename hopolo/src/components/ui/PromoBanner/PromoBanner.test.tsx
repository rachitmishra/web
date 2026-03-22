import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import PromoBanner from './PromoBanner';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useRouteLoaderData: vi.fn(),
  };
});

import { useRouteLoaderData } from 'react-router-dom';

describe('PromoBanner Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <PromoBanner />
      }
    ]);
    return render(<RouterProvider router={router} />);
  };

  it('should render nothing if settings are null', () => {
    (useRouteLoaderData as any).mockReturnValue({ settings: null });

    const { container } = renderComponent();
    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing if bannerVisible is false', () => {
    (useRouteLoaderData as any).mockReturnValue({
      settings: { bannerVisible: false, bannerText: 'Hidden' }
    });

    const { container } = renderComponent();
    expect(container).toBeEmptyDOMElement();
  });

  it('should render banner text and color when visible', async () => {
    (useRouteLoaderData as any).mockReturnValue({
      settings: {
        bannerVisible: true, 
        bannerText: 'Special Offer', 
        bannerColor: '#ff0000' 
      }
    });

    renderComponent();

    const banner = screen.getByText('Special Offer');
    expect(banner).toBeInTheDocument();
    // hex colors are converted to rgb in the DOM
    expect(banner).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
  });

  it('should wrap in a link if bannerLink is provided', () => {
    (useRouteLoaderData as any).mockReturnValue({
      settings: {
        bannerVisible: true, 
        bannerText: 'Click Me', 
        bannerLink: '/sale' 
      }
    });

    renderComponent();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/sale');
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
});

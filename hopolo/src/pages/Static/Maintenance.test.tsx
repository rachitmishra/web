import { describe, it, expect } from 'vitest';
  import { render, screen } from '@testing-library/react';
  import Maintenance from './Maintenance';
  
  describe('Maintenance Page', () => {
    it('should render the maintenance message', () => {
      render(<Maintenance />);
      expect(screen.getByText(/We'll Be Back Soon/i)).toBeInTheDocument();
      expect(screen.getByText(/Our boutique is currently undergoing scheduled maintenance/i)).toBeInTheDocument();
    });
  });
  
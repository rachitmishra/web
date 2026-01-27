import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from './Header';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useNotifications } from '../hooks/useNotifications';

// Mock hooks
vi.mock('../hooks/useOnlineStatus');
vi.mock('../hooks/useNotifications');

describe('Header', () => {
  beforeEach(() => {
    vi.mocked(useNotifications).mockReturnValue({
      requestPermission: vi.fn(),
      deactivateNotifications: vi.fn(),
      isEnabled: false,
    });
  });

  it('shows offline icon when offline', () => {
    vi.mocked(useOnlineStatus).mockReturnValue(false);
    render(
      <Header 
        theme="light" 
        toggleTheme={() => {}} 
        currentLanguage="en" 
        setCurrentLanguage={() => {}} 
        resetGame={() => {}} 
      />
    );
    expect(screen.getByTitle(/Offline Mode/i)).toBeInTheDocument();
  });

  it('hides offline icon when online', () => {
    vi.mocked(useOnlineStatus).mockReturnValue(true);
    render(
      <Header 
        theme="light" 
        toggleTheme={() => {}} 
        currentLanguage="en" 
        setCurrentLanguage={() => {}} 
        resetGame={() => {}} 
      />
    );
    expect(screen.queryByTitle(/Offline Mode/i)).not.toBeInTheDocument();
  });
});

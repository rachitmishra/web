import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FriendItem from './FriendItem';

const mockFriend = {
    uid: '123',
    userName: 'Test Friend',
    emoji: '🦊',
    streak: 5,
    earnedBadges: ['badge1'],
    lastPlayedDate: '2026-01-27',
};

describe('FriendItem', () => {
    const defaultProps = {
        friend: mockFriend,
        hasNudgedMe: false,
        handleNudge: vi.fn(),
        handleRemove: vi.fn(),
        onAvatarClick: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders friend info correctly', () => {
        render(<FriendItem {...defaultProps} />);
        expect(screen.getByText('Test Friend')).toBeInTheDocument();
        expect(screen.getByText('1 Badges')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('disables buttons and applies offline class when isOffline is true', () => {
        render(<FriendItem {...defaultProps} isOffline={true} />);
        
        const buttons = screen.getAllByTitle('Unavailable offline');
        const nudgeBtn = buttons[0];
        const removeBtn = buttons[1];

        expect(nudgeBtn).toBeDisabled();
        expect(removeBtn).toBeDisabled();
        expect(screen.getByText('Test Friend').closest('.friend-item')).toHaveClass('offline-mode');
    });

    it('calls handleNudge when nudge button is clicked and online', () => {
        render(<FriendItem {...defaultProps} isOffline={false} />);
        const nudgeBtn = screen.getByTitle('Send a nudge');
        fireEvent.click(nudgeBtn);
        expect(defaultProps.handleNudge).toHaveBeenCalledWith('123');
    });

    it('does not call handleNudge when clicked and offline', () => {
        render(<FriendItem {...defaultProps} isOffline={true} />);
        const buttons = screen.getAllByTitle('Unavailable offline');
        const nudgeBtn = buttons[0];
        fireEvent.click(nudgeBtn);
        expect(defaultProps.handleNudge).not.toHaveBeenCalled();
    });
});

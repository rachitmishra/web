import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SocialPanel from './SocialPanel';
import { useSocial } from '../hooks/useSocial';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Mock hooks
vi.mock('../hooks/useSocial');
vi.mock('../hooks/useOnlineStatus');
vi.mock('../context/AuthContext');
vi.mock('../context/ToastContext');

describe('SocialPanel', () => {
    const mockSocial = {
        friends: [],
        nudges: {},
        addFriend: vi.fn(),
        removeFriend: vi.fn(),
        nudgeFriend: vi.fn(),
        removeNudge: vi.fn(),
        getInviteLink: vi.fn().mockReturnValue('http://invite.link'),
        loading: false,
        checkUsernameAvailability: vi.fn(),
        updateProfile: vi.fn(),
        login: vi.fn(),
        myProfile: {
            userName: 'TestUser',
            emoji: '😀',
            streak: 10,
            earnedBadges: [],
            passcode: '1234'
        },
        deleteProfile: vi.fn(),
    };

    const mockAuth = {
        user: null,
        effectiveUid: 'uid123',
        loading: false,
        setRecoveredUid: vi.fn(),
    };

    const mockToast = {
        showToast: vi.fn(),
    };

    beforeEach(() => {
        vi.mocked(useSocial).mockReturnValue(mockSocial);
        vi.mocked(useAuth).mockReturnValue(mockAuth);
        vi.mocked(useToast).mockReturnValue(mockToast);
        vi.mocked(useOnlineStatus).mockReturnValue(true);
    });

    it('renders profile info correctly', () => {
        render(<SocialPanel />);
        const nameElements = screen.getAllByText('TestUser');
        expect(nameElements.length).toBeGreaterThan(0);
        expect(nameElements[0]).toBeInTheDocument();
    });

    it('shows offline indicator in community section when offline', () => {
        vi.mocked(useOnlineStatus).mockReturnValue(false);
        render(<SocialPanel />);
        expect(screen.getByTitle('Offline Mode')).toBeInTheDocument();
    });

    it('disables Invite Friend button when offline', () => {
        vi.mocked(useOnlineStatus).mockReturnValue(false);
        render(<SocialPanel />);
        const inviteBtn = screen.getByText(/Invite Friend/i).closest('button');
        expect(inviteBtn).toBeDisabled();
    });

    it('disables Recover Account button when offline', () => {
        vi.mocked(useOnlineStatus).mockReturnValue(false);
        render(<SocialPanel />);
        const recoverBtn = screen.getByText(/Recover Account/i).closest('button');
        expect(recoverBtn).toBeDisabled();
    });

    it('disables profile edit inputs when offline', () => {
        vi.mocked(useOnlineStatus).mockReturnValue(false);
        render(<SocialPanel />);
        
        // Enter edit mode
        const editBtn = screen.getByLabelText(/Edit Profile/i);
        fireEvent.click(editBtn);

        const nameInput = screen.getByDisplayValue('TestUser');
        const passcodeInput = screen.getByDisplayValue('1234');
        const saveBtn = screen.getByText(/Save/i).closest('button');

        expect(nameInput).toBeDisabled();
        expect(passcodeInput).toBeDisabled();
        expect(saveBtn).toBeDisabled();
    });
});

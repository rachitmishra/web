# Track Plan: User Authentication & Profile Management

## Phase 1: Auth Service & UI Foundation
- [x] Task: Configure Firebase Auth 325a945
    - Update `src/lib/firebase.ts` to export `auth`.
    - **Tests:** Verify `auth` instance is initialized.
- [x] Task: Implement AuthService 7cb2738
    - Create `src/services/authService.ts`.
    - Support `signInWithPhone`, `verifyOtp`, and `signOut`.
    - **Tests:** Mock Firebase Auth to verify sign-in/out logic.
- [x] Task: Create Auth UI Components 8689fff
    - Create `src/components/ui/Auth/PhoneSignIn.tsx` and `OtpVerification.tsx`.
    - **Tests:** Verify form submission and state transitions.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Auth Service & UI Foundation' (Protocol in workflow.md)

## Phase 2: Profile & Firestore Integration
- [ ] Task: Implement Profile Service
    - Create `src/services/profileService.ts`.
    - Support `getUserProfile`, `updateUserProfile`, and `saveAddress`.
    - **Tests:** Verify Firestore operations for the `users` collection.
- [ ] Task: Create Profile Page
    - Implement `src/pages/Profile.tsx` with Display Name, Emoji, and Address forms.
    - **Tests:** Verify that profile data is loaded and updates are reflected.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Profile & Firestore Integration' (Protocol in workflow.md)

## Phase 3: Header Integration & Navigation
- [ ] Task: Implement User Header Menu
    - Update `Header.tsx` to include Sign In / Profile dropdown.
    - **Tests:** Verify UI reflects auth state changes.
- [ ] Task: Setup Protected Routes
    - Protect `/profile` so only authenticated users can access it.
    - **Tests:** Verify redirection to `/` or sign-in for unauthenticated users.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Header Integration & Navigation' (Protocol in workflow.md)

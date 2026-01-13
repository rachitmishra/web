# Track Plan: Secure Profile Management & Admin Invitations

## Phase 1: React Router SSR Migration
- [x] Task: Configure React Router v7 Framework Mode 5ae5d7e
    - Update `vite.config.ts` to include the React Router plugin.
    - Set up `app/routes.ts` or the file-based routing structure.
    - **Tests:** Verify the dev server starts in SSR mode.
- [x] Task: Implement Server Entry Points 5ae5d7e
    - Create `entry.server.tsx` and `entry.client.tsx`.
    - **Tests:** Confirm basic page rendering via server.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: SSR Migration' (Protocol in workflow.md)

## Phase 2: Secure Data Layer (SSR Loaders & Actions)
- [ ] Task: Implement Server-Side Encryption Utilities
    - Use Node.js `crypto` or `crypto-js` within the server context.
    - **Tests:** Verify encryption/decryption with server environment variables.
- [ ] Task: Implement Profile Loader (Server-Side)
    - Create a loader for the Profile page that fetches and decrypts data from Firestore using `firebase-admin`.
    - **Tests:** Verify the browser receives decrypted data without the key.
- [ ] Task: Implement Profile Action (Server-Side)
    - Create an action to encrypt and update profile data.
    - **Tests:** Verify Firestore contains only encrypted strings after update.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Secure SSR Data Layer' (Protocol in workflow.md)

## Phase 3: Role Management & Invitations
- [ ] Task: Implement Admin Invitation Flow
    - Server-side action to create tokens in `invitations` collection.
    - Admin UI view for generating invites.
- [ ] Task: Handle Invitation Consumption
    - Check for pending invites in the onboarding/profile loader.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Invitations' (Protocol in workflow.md)

## Phase 4: Granular RBAC & Polish
- [ ] Task: Integrate RBAC in Loaders
    - Protect routes by checking user role in the server-side loader.
- [ ] Task: Final Polish & Cleanup
    - Remove redundant Cloud Functions if applicable.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Verification' (Protocol in workflow.md)
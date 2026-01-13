# Track Plan: Secure Profile Management & Admin Invitations

## Phase 1: Infrastructure & Automatic Onboarding
- [x] Task: Scaffold Firebase Cloud Functions 08835e8
    - Initialize the `functions` directory.
    - Set up dependencies (`firebase-admin`, `crypto-js` or native `crypto`).
    - **Tests:** Verify function environment variables load correctly.
- [x] Task: Implement Automatic Profile Creation db3c684
    - Create an `onCreate` Auth trigger function.
    - Initialize a Firestore document in `profiles` with default `user` role.
    - **Tests:** Simulate a user signup and verify Firestore document creation.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Automatic Onboarding' (Protocol in workflow.md)

## Phase 2: Secure Data Layer (Server-Side Encryption)
- [ ] Task: Implement Encryption Utilities
    - Create utility functions in Cloud Functions for AES-256 encryption/decryption.
    - **Tests:** Unit test encryption/decryption with the secret key.
- [ ] Task: Implement Secure Profile Access (Callable Functions)
    - Create `getSecureProfile` and `updateSecureProfile` callable functions.
    - These functions handle encryption/decryption before sending/receiving data.
    - **Tests:** Verify data is stored encrypted in Firestore but returned decrypted via the callable.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Secure Data Layer (Server-Side Encryption)' (Protocol in workflow.md)

## Phase 3: Role Management & Invitations
- [ ] Task: Implement Invitation Logic
    - Create `invitations` collection schema.
    - Implement `createInvite` Cloud Function (restricting use to `admin` role).
    - **Tests:** Verify token generation and phone number binding.
- [ ] Task: Create Admin Invitation UI
    - Implement a new view in the Admin dashboard to enter a phone number and select a role.
    - Display the generated invitation link/code.
    - **Tests:** Verify UI validation for phone numbers.
- [ ] Task: Handle Invitation Consumption
    - Update the `onCreate` profile logic to check for active invitations by phone number.
    - **Tests:** Verify a user with a pending invite gets the correct role (`editor`/`manager`/`admin`) instead of `user`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Role Management & Invitations' (Protocol in workflow.md)

## Phase 4: Granular RBAC Integration
- [ ] Task: Update Frontend Permissions
    - Refactor `AdminRoute` to handle specific role checks (e.g., `isManager`, `isEditor`).
    - Update `src/pages/Admin/Orders.tsx` and others to hide/show features based on granular roles.
    - **Tests:** Verify an 'Editor' is blocked from the Refunds action.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Granular RBAC Integration' (Protocol in workflow.md)

# Track Spec: Secure Profile Management & Admin Invitations

## Overview
Enhance the user management system by implementing automatic profile creation, server-side data encryption for privacy, and a granular invitation-based role assignment system for administrators.

## Functional Requirements
1.  **Automatic Profile Creation:**
    -   Implement a Firebase Auth trigger (Cloud Function) that creates a document in the `profiles` collection immediately upon user signup.
    -   Default fields: `role: 'user'`, `addresses: []`, `displayName: ''`, `emoji: ''`.
2.  **Secure Profile Management (React Router SSR):**
    -   Migrate the application to use **React Router v7 Framework mode (SSR)**.
    -   **Server-Side Loaders:** Implement `loader` functions for the Profile page to fetch and decrypt user data on the server.
    -   **Server-Side Actions:** Implement `action` functions to encrypt and store data during profile updates.
    -   **Security:** Encryption/Decryption logic and the secret key reside exclusively on the server.
3.  **Granular Role-Based Access Control (RBAC):**
    -   Define roles: `user`, `editor` (inventory), `manager` (orders/refunds), and `admin` (full).
    -   Verify roles in server-side `loaders` to prevent unauthorized access before the page even renders.
4.  **Admin Invitation System:**
    -   Admin UI to invite new users via phone number.
    -   Server-side `action` to generate and store secure invitation tokens.
    -   Consumption logic: Check for invitations in the onboarding flow (action/loader) to assign roles correctly.

## Non-Functional Requirements
-   **Security:** The encryption key must be an environment variable accessible ONLY to the server process.
-   **UX:** Faster initial loads via SSR and better security for sensitive data.

## Acceptance Criteria
-   A new signup automatically results in a Firestore profile document.
-   Profile data appears as encrypted strings in the Firebase Console but as plain text in the app UI.
-   An 'Editor' can access Inventory but not Refunds.
-   An invitation sent to a mobile number successfully assigns the correct role upon first login.

## Out of Scope
-   Automated SMS sending (Admin manually shares the generated link).
-   Self-service role requests for users.

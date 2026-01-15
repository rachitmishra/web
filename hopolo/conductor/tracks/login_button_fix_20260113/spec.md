# Specification: Fix Login Submit Button State

## Overview
The goal of this track is to fix a bug on the Login page where the "Send Code" button remains disabled even after the user enters a phone number. Additionally, we must verify that client-side Firebase Auth works correctly within the new React Router SSR architecture.

## Problem Description
-   **Context:** The `PhoneSignIn` component controls the disabled state of the submit button. The application recently migrated to React Router SSR.
-   **Observed Behavior:** The button remains visually disabled.
-   **Expected Behavior:** The button enables on input, and clicking it successfully triggers the client-side Firebase Auth flow (`signInWithPhoneNumber`) even when the page is initially rendered on the server.

## Root Cause Hypotheses
1.  **State Update Issue:** The `onChange` handler might not be correctly updating the `phoneNumber` state.
2.  **SSR/Client Mismatch:** The hydration process might be interfering with the state initialization or event listeners.
3.  **Auth Service Integration:** The `signInWithPhone` service might be failing silently or not initializing the Recaptcha verifier correctly in the SSR environment.

## Functional Requirements
1.  **Enable Button on Input:** Ensure the "Send Code" button enables immediately when the phone number field is not empty.
2.  **Verify Loading State:** Ensure the `loading` state is false by default.
3.  **Client-Side Auth Verification:** Ensure `signInWithPhoneNumber` works correctly on the client, initializing the Recaptcha verifier without errors after hydration.

## Non-Functional Requirements
-   **Responsiveness:** UI reacts immediately.
-   **SSR Compatibility:** Authentication logic must gracefully handle the transition from server-rendered HTML to client-side interactivity.

## Acceptance Criteria
-   [ ] The "Send Code" button enables when the user types.
-   [ ] Clicking the button triggers the Firebase Recaptcha verification.
-   [ ] A "Code Sent" confirmation (or error) is received from Firebase.
-   [ ] Automated tests verify the button state.

## Out of Scope
-   Server-side session cookie management (handled in a separate track).

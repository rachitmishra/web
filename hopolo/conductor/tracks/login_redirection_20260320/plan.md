# Implementation Plan: Fix Login Dialog and Admin Redirection

This plan outlines the steps to resolve the OTP dialog dismissal issue and implement the missing admin redirection logic in the Hopolo application.

## Phase 1: Investigation and Preparation
- [ ] **Task 1: Analyze Existing Login Flow**
    - [ ] Locate the component(s) responsible for rendering and managing the OTP verification dialog.
    - [ ] Review the existing login logic to understand how successful authentication is handled and where the redirection is currently (or should be) triggered.
    - [ ] Verify how user roles (Admin vs. Standard User) are determined in the frontend.

## Phase 2: Implementation of Fixes (TDD)
- [ ] **Task 2: Implement Automatic OTP Dialog Dismissal**
    - [ ] **Red Phase:** Write a unit test for the login component to verify that the OTP verification dialog remains open upon successful login (demonstrating the bug).
    - [ ] **Green Phase:** Modify the login logic to ensure that the state responsible for the dialog's visibility is correctly updated (dismissed) upon successful OTP verification.
    - [ ] **Refactor:** Clean up the logic and ensure it follows existing component patterns.
    - [ ] **Verification:** Run the tests and confirm they pass.
- [ ] **Task 3: Implement Admin Redirection Logic**
    - [ ] **Red Phase:** Write a unit test to verify that an admin user is NOT currently redirected to `/admin` after login.
    - [ ] **Green Phase:** Update the post-login callback to check for the 'Admin' role and trigger a redirect to `/admin` using the project's routing system (e.g., React Router).
    - [ ] **Refactor:** Ensure the redirection is handled securely and cleanly.
    - [ ] **Verification:** Run the tests and confirm they pass.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Implementation of Fixes' (Protocol in workflow.md)**

## Phase 3: Final Verification and Cleanup
- [ ] **Task 4: Regression Testing and Coverage**
    - [ ] Run the full suite of authentication-related tests to ensure no regressions were introduced.
    - [ ] Verify that code coverage for the newly added or modified authentication logic exceeds 80%.
    - [ ] Perform a manual smoke test of the complete login flow for both admin and standard users.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Final Verification and Cleanup' (Protocol in workflow.md)**
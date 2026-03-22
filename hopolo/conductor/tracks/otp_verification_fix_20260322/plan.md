# Implementation Plan: Fix OTP Verification Redirection and Error Handling

## Phase 1: Investigation and Setup
- [x] **Task 1: Analyze Login Components**
    - [x] Inspect the OTP verification component(s) (e.g., `OtpVerification`, `Login`, `LoginDialog`) to understand how OTP submission is currently handled.
    - [x] Identify where the `verifyOtp` function is called and how the resulting `userCredential` and errors are processed.
    - [x] Review how the user's role is determined after a successful login.
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Investigation and Setup' (Protocol in workflow.md)**

## Phase 2: Implement Error Handling
- [x] **Task 2: Display Invalid OTP Error**
    - [x] **Red Phase:** Write a unit test for the OTP verification component simulating an incorrect OTP and asserting that an error message is displayed.
    - [x] **Green Phase:** Update the component state to catch the error from the `verifyOtp` call and render the error message on the UI.
    - [x] **Refactor:** Ensure the error message styling is consistent with other form errors.
    - [x] **Verification:** Run tests and ensure they pass.
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Implement Error Handling' (Protocol in workflow.md)**

## Phase 3: Implement Redirection Logic
- [x] **Task 3: Role-Based Redirection on Success**
    - [x] **Red Phase:** Write unit tests to verify that upon successful OTP verification, the component triggers a redirect to `/admin` for admins and `/profile` for standard users.
    - [x] **Green Phase:** Update the successful login logic. After a successful `verifyOtp`, check the user's role and use the router's navigation to redirect to the appropriate path. Ensure any login dialogs are dismissed.
    - [x] **Refactor:** Clean up the redirection logic, potentially moving it to a shared auth hook or the component's action handler if applicable.
    - [x] **Verification:** Run tests to confirm both standard user and admin redirects.
- [x] **Task: Conductor - User Manual Verification 'Phase 3: Implement Redirection Logic' (Protocol in workflow.md)**
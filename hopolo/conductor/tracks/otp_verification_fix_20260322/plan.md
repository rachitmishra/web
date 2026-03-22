# Implementation Plan: Fix OTP Verification Redirection and Error Handling

## Phase 1: Investigation and Setup
- [ ] **Task 1: Analyze Login Components**
    - [ ] Inspect the OTP verification component(s) (e.g., `OtpVerification`, `Login`, `LoginDialog`) to understand how OTP submission is currently handled.
    - [ ] Identify where the `verifyOtp` function is called and how the resulting `userCredential` and errors are processed.
    - [ ] Review how the user's role is determined after a successful login.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: Investigation and Setup' (Protocol in workflow.md)**

## Phase 2: Implement Error Handling
- [ ] **Task 2: Display Invalid OTP Error**
    - [ ] **Red Phase:** Write a unit test for the OTP verification component simulating an incorrect OTP and asserting that an error message is displayed.
    - [ ] **Green Phase:** Update the component state to catch the error from the `verifyOtp` call and render the error message on the UI.
    - [ ] **Refactor:** Ensure the error message styling is consistent with other form errors.
    - [ ] **Verification:** Run tests and ensure they pass.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Implement Error Handling' (Protocol in workflow.md)**

## Phase 3: Implement Redirection Logic
- [ ] **Task 3: Role-Based Redirection on Success**
    - [ ] **Red Phase:** Write unit tests to verify that upon successful OTP verification, the component triggers a redirect to `/admin` for admins and `/profile` for standard users.
    - [ ] **Green Phase:** Update the successful login logic. After a successful `verifyOtp`, check the user's role and use the router's navigation to redirect to the appropriate path. Ensure any login dialogs are dismissed.
    - [ ] **Refactor:** Clean up the redirection logic, potentially moving it to a shared auth hook or the component's action handler if applicable.
    - [ ] **Verification:** Run tests to confirm both standard user and admin redirects.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Implement Redirection Logic' (Protocol in workflow.md)**
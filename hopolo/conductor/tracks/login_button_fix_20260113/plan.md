# Track Plan: Fix Login Submit Button State

## Phase 1: Investigation & Test Setup [checkpoint: c044011]
- [x] Task: Create Reproduction Test
    - Create a test file `src/components/ui/Auth/PhoneSignIn.repro.test.tsx`.
    - Write a test that simulates entering text into the phone number input and asserts the button state.
    - **Tests:** Verify the button remains disabled in the test (reproducing the reported bug).
- [x] Task: Verify Firebase Auth Initialization
    - Check `src/lib/firebase.ts` and `src/services/authService.ts` to ensure `auth` is correctly initialized on the client.
    - **Tests:** Manual verification or unit test mocking the auth import.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Investigation' (Protocol in workflow.md) c044011

## Phase 2: Implementation & Fix [checkpoint: 0e7ee56]
- [x] Task: Fix State Update Logic 22023d3
    - Audit `src/components/ui/Auth/PhoneSignIn.tsx` for issues in `onChange` or `value` props.
    - Ensure `loading` state is correctly handled in the parent `Login.tsx`.
    - **Tests:** Run the reproduction test and confirm it now passes.
- [x] Task: Verify/Fix Client-Side Auth in SSR 22023d3
    - Ensure `signInWithPhone` waits for hydration or is called only in client-side handlers (it is, via `onSubmit`).
    - Verify `recaptcha-container` presence in the DOM.
- [x] Task: Final Build & Linting 2920aa6
    - Run `npm run build` and `npm run lint` to ensure no regressions.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Implementation & Fix' (Protocol in workflow.md) 0e7ee56

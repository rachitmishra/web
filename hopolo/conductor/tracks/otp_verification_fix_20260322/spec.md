# Specification: Fix OTP Verification Redirection and Error Handling

## Overview
This track addresses an issue on the OTP verification page where users are not correctly redirected upon successful login, and error messages are not displayed when an incorrect OTP is entered.

## Functional Requirements
- **Role-Based Redirection:** Upon successful OTP verification, the system MUST check the user's role and redirect them appropriately:
  - Admin users MUST be redirected to the `/admin` panel.
  - Standard users MUST be redirected to their `/profile` page.
- **Error Handling:** If an incorrect OTP is entered, an appropriate error message MUST be displayed on the page to inform the user.
- **Dialog Dismissal:** If the OTP is entered via a dialog/modal (as opposed to a standalone page), the dialog MUST be dismissed upon successful login.

## Non-Functional Requirements
- **User Experience:** The redirection and error display should be immediate to prevent confusion.

## Acceptance Criteria
- [ ] Entering a correct OTP for an admin user dismisses the login interface and redirects to `/admin`.
- [ ] Entering a correct OTP for a standard user dismisses the login interface and redirects to `/profile`.
- [ ] Entering an incorrect OTP clearly displays an error message on the screen.
- [ ] No regressions in the existing phone number entry step.

## Out of Scope
- Changes to the authentication provider (Firebase Auth).
- Modifying the visual design of the login page beyond displaying the error state.
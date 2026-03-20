# Specification: Fix Login Dialog and Admin Redirection

## Overview
This track addresses two critical bugs in the authentication flow of the Hopolo application:
1.  **OTP Dialog Persistence:** The OTP verification dialog remains open even after a successful login with a mobile number.
2.  **Missing Admin Redirection:** Admin users are not automatically redirected to the admin dashboard (`/admin`) after a successful login.

## Functional Requirements
- **Automatic Dialog Dismissal:** Upon successful verification of the OTP, the verification dialog/modal MUST be dismissed immediately for all users.
- **Conditional Admin Redirection:** Following a successful login, the system MUST check the user's role:
    - If the user is an **Admin**, they MUST be automatically redirected to the `/admin` route.
    - If the user is a **Standard User**, they should remain on the current page or be redirected to a default non-admin landing page (as per existing logic).
- **Role Verification:** The redirection logic must rely on a secure role check (e.g., Firestore user profile or Firebase Auth custom claims).

## Non-Functional Requirements
- **User Experience:** The transition from login to the dashboard should be seamless and "instant" in accordance with the product's core goals.
- **Security:** Ensure that only authorized admins are redirected and granted access to the `/admin` page.

## Acceptance Criteria
- [ ] OTP verification dialog closes automatically after successful OTP entry.
- [ ] Admin users are redirected to `/admin` immediately after a successful login.
- [ ] Standard users are NOT redirected to the admin page.
- [ ] Existing authentication flows (phone number/OTP) continue to function correctly.

## Out of Scope
- Modifications to the Razorpay checkout or other third-party integrations.
- UI/UX redesign of the login components beyond the dismissal logic.
- Implementation of new authentication methods.
# Specification: Configurable Storefront & Maintenance Mode

## Overview
This track introduces dynamic control over key storefront elements. Admins will be able to configure the homepage promo banner (text, color, link, visibility) and toggle a "Maintenance Mode" that redirects non-admin traffic to a dedicated landing page.

## Functional Requirements
1.  **Admin: Storefront Settings Interface:**
    -   Create a new "Storefront" section in the Admin Dashboard.
    -   **Promo Banner Controls:**
        -   Text Input: The message to display.
        -   Color Picker/Input: The background color of the banner.
        -   Link Input: The URL destination for banner clicks.
        -   Visibility Toggle: Switch to enable/disable the banner.
    -   **Maintenance Mode Control:**
        -   Maintenance Toggle: Switch to enable/disable site-wide maintenance mode.
    -   **Persistence:** Save settings to a single `settings/storefront` document in Firestore.

2.  **Frontend: Dynamic Promo Banner:**
    -   Update the existing promo banner to subscribe to the `settings/storefront` document.
    -   Apply configured styles and content dynamically.
    -   Hide the banner if `isVisible` is false.

3.  **Frontend: Maintenance Mode (Close State):**
    -   Implement a redirect mechanism (e.g., in `App.tsx` or a dedicated wrapper).
    -   If `isMaintenanceMode` is true:
        -   Redirect standard users to a new `/maintenance` static route.
        -   **Exception:** Allow users with the `admin` role to bypass the redirect to ensure they can still manage the site and preview changes.
    -   Create a simple, professional `/maintenance` page.

## Non-Functional Requirements
-   **Real-time Updates:** Use Firestore listeners (`onSnapshot`) where appropriate to ensure settings take effect immediately without a page refresh.
-   **Security:** Ensure only users with the `admin` role can read/write the `settings/storefront` document (verified via Firestore Security Rules).

## Acceptance Criteria
-   [ ] Admin can change the promo banner color and text, and see it updated on the homepage.
-   [ ] Toggling the banner visibility in admin hides/shows it for all users.
-   [ ] When maintenance mode is ON, a standard user visiting any page is redirected to `/maintenance`.
-   [ ] When maintenance mode is ON, an admin user can still access the site normally.
-   [ ] When maintenance mode is OFF, the `/maintenance` page is inaccessible or redirects back to home.

## Out of Scope
-   Scheduling maintenance (e.g., "starts at 2 PM").
-   Multiple banner rotations (single banner only).

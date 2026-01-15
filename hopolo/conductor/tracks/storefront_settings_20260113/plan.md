# Track Plan: Configurable Storefront & Maintenance Mode

## Phase 1: Infrastructure & Admin UI
- [x] Task: Create Storefront Settings Service 13d889e
    - Implement `storefrontService.ts` with functions to fetch and update global settings in Firestore.
    - **Tests:** Verify service correctly reads/writes to the `settings/storefront` document.
- [ ] Task: Create Admin Storefront Page
    - Implement a new view in the Admin dashboard with inputs for banner text, color, link, and maintenance toggle.
    - **Tests:** Verify UI state updates correctly and calls the service on save.
- [ ] Task: Update Admin Sidebar/Navigation
    - Add a link to the new "Storefront" settings page.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Admin UI' (Protocol in workflow.md)

## Phase 2: Dynamic Promo Banner
- [ ] Task: Update PromoBanner Component
    - Modify the existing banner to use real-time data from the `storefrontService`.
    - Apply dynamic background color and text.
    - **Tests:** Verify banner visibility and styles change based on mocked Firestore state.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Dynamic Promo Banner' (Protocol in workflow.md)

## Phase 3: Maintenance Mode
- [ ] Task: Create Maintenance Landing Page
    - Implement a simple, clean `/maintenance` route with a "We'll be back" message.
    - **Tests:** Verify the page renders correctly.
- [ ] Task: Implement Maintenance Redirect Logic
    - Create a wrapper component or update `App.tsx` to check the maintenance flag and user role.
    - **Tests:** Verify standard users are redirected while admins are not.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Maintenance Mode' (Protocol in workflow.md)

## Phase 4: Final Polish & Security
- [ ] Task: Firestore Security Rules
    - Ensure only admins can modify the `settings/` collection.
- [ ] Task: Final Build & Linting
    - Rerun all tests and ensure production build passes.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polish' (Protocol in workflow.md)

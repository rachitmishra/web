# Track Plan: Configurable Storefront & Maintenance Mode

## Phase 1: Infrastructure & Admin UI [checkpoint: 341a201]
- [x] Task: Create Storefront Settings Service 13d889e
    - Implement `storefrontService.ts` with functions to fetch and update global settings in Firestore.
    - **Tests:** Verify service correctly reads/writes to the `settings/storefront` document.
- [x] Task: Create Admin Storefront Page a7f6203
    - Implement a new view in the Admin dashboard with inputs for banner text, color, link, and maintenance toggle.
    - **Tests:** Verify UI state updates correctly and calls the service on save.
- [x] Task: Update Admin Sidebar/Navigation 34f3ead
    - Add a link to the new "Storefront" settings page.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Admin UI' (Protocol in workflow.md)

## Phase 2: Dynamic Promo Banner [checkpoint: 48df03c]
- [x] Task: Create PromoBanner Component 506e80c
    - Implement a new `PromoBanner` component that uses real-time data from `storefrontService`.
    - Component should listen to Firestore updates for immediate feedback.
    - Apply dynamic background color and text.
    - **Tests:** Verify banner visibility and styles change based on mocked Firestore state.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Dynamic Promo Banner' (Protocol in workflow.md)

## Phase 3: Maintenance Mode [checkpoint: 4b9d753]
- [x] Task: Create Maintenance Landing Page 20c5464
    - Implement a simple, clean `/maintenance` route with a "We'll be back" message.
    - **Tests:** Verify the page renders correctly.
- [x] Task: Implement Maintenance Redirect Logic 4345dad
    - Create a wrapper component or update `App.tsx` to check the maintenance flag and user role.
    - **Tests:** Verify standard users are redirected while admins are not.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Maintenance Mode' (Protocol in workflow.md) 4b9d753

## Phase 4: Final Polish & Security
- [x] Task: Firestore Security Rules (Documented in Git Note)
    - Ensure only admins can modify the `settings/` collection.
- [~] Task: Final Build & Linting
    - Rerun all tests and ensure production build passes.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polish' (Protocol in workflow.md)

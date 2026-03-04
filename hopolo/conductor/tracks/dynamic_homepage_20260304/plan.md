# Implementation Plan: Fully Dynamic Homepage Configuration

## Phase 1: Data Model & Service Layer
- [x] Task: Update `StorefrontSettings` Interface and Service b9b5c71
    - Add `heroTitle`, `heroSubtitle`, `heroImage`, `heroCtaText`, and `reviews` to `StorefrontSettings`.
    - Update `getStorefrontSettings` to provide default values if Firestore is empty.
    - **Tests:** Verify `getStorefrontSettings` returns default values for new fields.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Service Layer' (Protocol in workflow.md)

## Phase 2: Admin Storefront Dashboard Enhancement
- [ ] Task: Create Tests for Storefront Admin Page
    - Mock `StorefrontSettings` with new fields.
    - **Tests:** Verify inputs exist for Hero settings and Reviews.
- [ ] Task: Implement Hero Settings Form in Admin Dashboard
    - Update `Storefront.tsx` to include fields for Hero Title, Subtitle, Image URL, and CTA Text.
    - **Tests:** Verify fields are present and save correctly to the service.
- [ ] Task: Implement Reviews Management in Admin Dashboard
    - Add a dynamic list for adding/removing customer reviews in `Storefront.tsx`.
    - **Tests:** Verify reviews can be added and deleted from the state before saving.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Admin Dashboard' (Protocol in workflow.md)

## Phase 3: Homepage Integration & Final Polish
- [ ] Task: Create Tests for Dynamic Homepage
    - Mock `StorefrontSettings` to return custom hero content and reviews.
    - **Tests:** Verify `CinematicHero` and the review section display the mocked content.
- [ ] Task: Refactor Homepage to use Dynamic Settings
    - Use `getStorefrontSettings` (or subscription) in `Home.tsx`.
    - Replace hardcoded Hero and Review arrays with settings data.
    - **Tests:** Verify the homepage reflects live data from the Firestore settings.
- [ ] Task: Final Polish & CSS Adjustments
    - Ensure the Admin Storefront form layout is clean and responsive.
    - **Tests:** Visual check of the new admin sections and the dynamic homepage.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Verification' (Protocol in workflow.md)

# Implementation Plan: Fully Dynamic Homepage Configuration

## Phase 1: Data Model & Service Layer [checkpoint: 05ae769]
- [x] Task: Update `StorefrontSettings` Interface and Service b9b5c71
    - Add `heroTitle`, `heroSubtitle`, `heroImage`, `heroCtaText`, and `reviews` to `StorefrontSettings`.
    - Update `getStorefrontSettings` to provide default values if Firestore is empty.
    - **Tests:** Verify `getStorefrontSettings` returns default values for new fields.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Service Layer' (Protocol in workflow.md) 05ae769

## Phase 2: Admin Storefront Dashboard Enhancement [checkpoint: aa96736]
- [x] Task: Create Tests for Storefront Admin Page a3fff0e
    - Mock `StorefrontSettings` with new fields.
    - **Tests:** Verify inputs exist for Hero settings and Reviews.
- [x] Task: Implement Hero Settings Form in Admin Dashboard c2a83ac
    - Update `Storefront.tsx` to include fields for Hero Title, Subtitle, Image URL, and CTA Text.
    - **Tests:** Verify fields are present and save correctly to the service.
- [x] Task: Implement Reviews Management in Admin Dashboard 737d90a
    - Add a dynamic list for adding/removing customer reviews in `Storefront.tsx`.
    - **Tests:** Verify reviews can be added and deleted from the state before saving.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Admin Dashboard' (Protocol in workflow.md) aa96736

## Phase 3: Homepage Integration & Final Polish
- [x] Task: Create Tests for Dynamic Homepage 7f0992e
    - Mock `StorefrontSettings` to return custom hero content and reviews.
    - **Tests:** Verify `CinematicHero` and the review section display the mocked content.
- [x] Task: Refactor Homepage to use Dynamic Settings adb9b32
    - Use `getStorefrontSettings` (or subscription) in `Home.tsx`.
    - Replace hardcoded Hero and Review arrays with settings data.
    - **Tests:** Verify the homepage reflects live data from the Firestore settings.
- [x] Task: Final Polish & CSS Adjustments fb5fa7d
    - Ensure the Admin Storefront form layout is clean and responsive.
    - **Tests:** Visual check of the new admin sections and the dynamic homepage.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Verification' (Protocol in workflow.md)

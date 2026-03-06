# Implementation Plan: Admin Panel UI Polish & Consistency

## Phase 1: Icon Integration & Library Setup [checkpoint: 8db5f90]
- [x] Task: Install `lucide-react` dependency 6d57c10
    - Run package manager to install the library.
    - **Tests:** Verify package is in `package.json`.
- [x] Task: Update `AdminSidebar` with Lucide Icons 789cfa1
    - Replace existing emoji string icons with imported Lucide components.
    - **Tests:** Update `AdminSidebar.test.tsx` to ensure icons render without breaking the component.
- [x] Task: Replace remaining emojis in Admin Pages 8fc07d6
    - Scan admin pages (e.g., Inventory, Orders) and replace action emojis with Lucide icons.
    - **Tests:** Run all admin tests to ensure no regressions.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Icon Integration' (Protocol in workflow.md) 8db5f90

## Phase 2: Custom CSS & Component Consistency [checkpoint: c98d8b7]
- [x] Task: Refine Global/Admin CSS Variables 567f693
    - Update spacing, typography, and color variables for a more professional look in global CSS or AdminLayout.
    - **Tests:** Visual regression checks (manual).
- [x] Task: Standardize Admin Components 8977167
    - Review `Button`, `Input`, and `Card` usages within `/admin` routes.
    - Ensure consistent classes, paddings, and border-radii are applied.
    - **Tests:** Ensure unit tests for `Button` and `Input` still pass with any style modifications.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Custom CSS' (Protocol in workflow.md) c98d8b7

## Phase 3: Mobile Optimization & Route Verification
- [x] Task: Optimize Mobile Layouts f873a37
    - Adjust CSS modules for admin pages (e.g., Orders table, Inventory grid) to stack correctly on small screens (`max-width: 768px`).
    - Ensure touch targets are at least 44x44px.
    - **Tests:** Add/update responsive tests if applicable, verify rendering via mobile dev tools.
- [~] Task: Verify and Fix Admin Routes
    - Audit `app/routes.ts` and `src/App.tsx` admin sections.
    - Ensure all links in the sidebar navigate to the correct, functional page.
    - **Tests:** Run `src/routes.integration.test.tsx` to confirm routing integrity.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Mobile Optimization & Routing' (Protocol in workflow.md)

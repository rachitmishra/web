# Implementation Plan: Collapsible Sidebar for Admin Panel

## Phase 1: Layout & Components
- [ ] Task: Create `AdminSidebar` Component and Styles
    - Implement the sidebar with navigation links and icons.
    - Add collapse/expand functionality.
    - **Tests:** Verify sidebar renders links and toggle button.
- [ ] Task: Create `AdminLayout` Component
    - Integrate `AdminSidebar` and `Outlet`.
    - Handle responsive layout (mobile hamburger menu).
    - **Tests:** Verify layout renders sidebar and main content area.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Layout' (Protocol in workflow.md)

## Phase 2: Routing & Integration
- [ ] Task: Update Admin Routing in `app/routes.ts`
    - Wrap admin routes in `AdminLayout`.
    - Ensure nested paths work correctly.
    - **Tests:** Verify navigation to `/admin` and sub-routes loads the layout.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Routing' (Protocol in workflow.md)

## Phase 3: Page Refactoring & Polish
- [ ] Task: Refactor Admin Pages
    - Remove manual navigation buttons from all admin pages listed in spec.
    - Ensure consistent header/title styling across pages.
    - **Tests:** Verify buttons are removed and pages look correct.
- [ ] Task: Final Polish & Responsive Fixes
    - Fine-tune animations and mobile overlay behavior.
    - Ensure sidebar state is persistent (optional enhancement).
    - **Tests:** Manual visual check on different screen sizes.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Verification' (Protocol in workflow.md)

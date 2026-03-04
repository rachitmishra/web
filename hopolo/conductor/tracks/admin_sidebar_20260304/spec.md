# Specification: Collapsible Sidebar for Admin Panel

## Overview
The current admin panel uses manually added navigation buttons on each page. This track replaces that with a centralized, collapsible sidebar navigation within a common `AdminLayout`.

## Goals
- Create a reusable `AdminLayout` and `AdminSidebar` component.
- Implement a collapsible state for the sidebar (persistent across page transitions).
- Update admin routes to use the new layout.
- Refactor all existing admin pages to remove redundant navigation buttons.
- Ensure the sidebar is responsive (hide/overlay on mobile).

## Technical Changes

### 1. New Components
- `src/components/layout/AdminLayout.tsx`: Common layout for all admin pages.
- `src/components/layout/AdminSidebar/AdminSidebar.tsx`: The sidebar component with navigation links.
- `src/components/layout/AdminSidebar/AdminSidebar.module.css`: Styles for the sidebar, including collapse animations and mobile responsiveness.

### 2. Routing Update
- Update `app/routes.ts` to use `AdminLayout` as a parent route for all `/admin/*` paths.

### 3. Page Refactoring
Update the following pages to remove manual navigation buttons and ensure they fit well within the new layout:
- `src/pages/Admin/Orders.tsx`
- `src/pages/Admin/Inventory.tsx`
- `src/pages/Admin/Marketing.tsx`
- `src/pages/Admin/Storefront.tsx`
- `src/pages/Admin/Analytics.tsx`
- `src/pages/Admin/Invitations.tsx`
- `src/pages/Admin/EmailLogs.tsx`
- `src/pages/Admin/SeedData.tsx`

### 4. Responsive Design
- Sidebar should collapse to icons only on tablet/desktop.
- Sidebar should be hidden behind a toggle (hamburger menu) on mobile.

## Acceptance Criteria
- [ ] Admin pages are wrapped in `AdminLayout`.
- [ ] Sidebar allows navigation between all admin modules.
- [ ] Sidebar can be collapsed/expanded.
- [ ] Active route is highlighted in the sidebar.
- [ ] Sidebar is responsive and works well on mobile.
- [ ] Redundant navigation buttons are removed from all admin pages.

# Specification: Admin Panel UI Polish & Consistency

## Overview
The goal of this track is to elevate the visual quality and consistency of the entire Hopolo Admin Panel. This involves integrating professional icons, ensuring all routes are functional, refining custom CSS for UI elements (buttons, inputs, cards), and heavily prioritizing a mobile-first design approach for administrative workflows.

## Goals
-   **Iconography:** Integrate `lucide-react` (or similar lightweight SVG library) to replace emojis and inconsistent icons across the admin interface.
-   **UI Beautification:** Refine existing custom CSS variables to create a more polished, modern, and professional aesthetic.
-   **Component Consistency:** Ensure all buttons, form inputs, and data display cards follow a unified design language.
-   **Mobile-First Design:** Optimize layouts, touch targets, and navigation (like the sidebar) for seamless use on mobile devices.
-   **Route Verification:** Confirm all `/admin/*` routes are correctly linked and functional within the new layout.

## Technical Changes
### 1. Icon Integration
-   Install `lucide-react`.
-   Replace emoji icons in `AdminSidebar.tsx` and across various admin pages with consistent Lucide icons.

### 2. Custom CSS Refinement
-   Update `src/index.css` (or relevant global style files) to refine typography, spacing, colors, and border-radii for a more premium feel.
-   Standardize `Button` and `Input` component styles in their respective `.module.css` files.

### 3. Mobile Optimization
-   Review and adjust media queries in `AdminLayout.module.css` and individual page styles to ensure tables, forms, and cards stack correctly on small screens.
-   Ensure interactive elements have a minimum touch target size of 44x44px.

### 4. Route Verification
-   Audit all links within the `AdminSidebar` and internal page navigation to guarantee no broken routes.

## Acceptance Criteria
- [ ] `lucide-react` is installed and used consistently across the admin panel.
- [ ] Buttons and form inputs share a cohesive, professional design.
- [ ] All admin pages (Orders, Inventory, Storefront, etc.) are usable and visually appealing on mobile viewports.
- [ ] All navigation links within the admin panel route correctly without errors.
- [ ] The overall aesthetic feels like a polished, "professional-grade" tool.
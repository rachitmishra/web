# Specification: Homepage Polish & Brand-First Enhancements

## Overview
The goal of this track is to refine the Hopolo homepage to better reflect its "Brand-First Design" core goal. We will transform the initial layout into a polished, immersive experience featuring high-impact visual sections and fluid interactions that minimize friction for shoppers.

## Functional Requirements
1.  **Cinematic Hero Section:**
    - Replace the current hero with a full-screen immersive component.
    - Support for a large background image with a semi-transparent overlay for readability.
    - Prominent "Shop Now" call-to-action (CTA) that scrolls to the product grid or links to a featured collection.
2.  **Best Sellers Section:**
    - Implement a dedicated row or grid to highlight "Best Seller" products.
    - Products should be dynamically identified based on a `isBestSeller` flag in Firestore or a similar metadata field.
3.  **Interactive Category Filtering:**
    - Implement real-time, zero-reload category switching.
    - Use smooth layout transitions (e.g., fade and slight slide) when the product grid updates based on the selected category.
4.  **Social Proof Integration:**
    - Refine the "Loved by Customers" section with a more professional card layout.
    - Ensure it is responsive and visually consistent with the rest of the site.
5.  **Mobile-First Refinement:**
    - Ensure the cinematic hero scales gracefully on small screens.
    - Optimize the product grid and category tabs for touch interactions and smaller viewports.

## Non-Functional Requirements
-   **Performance:** Maintain fast initial load times despite higher-impact imagery.
-   **Aesthetics:** Adhere to the custom CSS-variable based design system, emphasizing a clean and playful boutique feel.
-   **UX:** Fluid interactions with minimal visual "jumps" during state changes.

## Acceptance Criteria
-   [ ] Full-screen hero section renders correctly across all major browsers and mobile devices.
-   [ ] "Best Sellers" section appears and displays the correct products.
-   [ ] Category tabs switch the product grid instantly without a page reload, using smooth animations.
-   [ ] Homepage build passes linting and unit tests.

## Out of Scope
-   Backend logic for calculating "Best Sellers" based on actual sales data (will use metadata flag for now).
-   Integration of live Instagram feeds (static snippets or manual testimonials only).

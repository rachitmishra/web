# Track Plan: Storefront Polish & Variants

## Phase 1: Product Variants
- [x] Task: Update Product & Cart Data Model c94cea1
    - Update `Product` interface in `src/services/productService.ts`.
    - Update `CartItem` in `src/services/cartService.ts` to include `selectedSize` and `selectedColor`.
    - **Tests:** Update service tests to handle new fields.
- [x] Task: Update Product Detail UI 7de6389
    - Update `src/pages/ProductDetail.tsx` to render Size/Color selectors.
    - Validate selection before adding to cart.
    - **Tests:** Verify variant selectors appear and validation works.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Product Variants' (Protocol in workflow.md)

## Phase 2: Footer & Homepage Polish
- [ ] Task: Enhance Footer & Static Pages
    - Create `src/pages/Static/InfoPages.tsx` (generic component).
    - Update `src/components/layout/MainLayout.tsx` footer with links.
    - Add routes in `App.tsx`.
    - **Tests:** Verify navigation to info pages.
- [ ] Task: Add Homepage Reviews
    - Update `src/pages/Home.tsx` to include a "Featured Reviews" section.
    - **Tests:** Verify reviews section renders.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Footer & Homepage Polish' (Protocol in workflow.md)

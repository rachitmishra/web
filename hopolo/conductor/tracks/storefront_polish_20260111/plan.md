# Track Plan: Storefront Polish & Variants

## Phase 1: Product Variants [checkpoint: 64dfa50]
- [x] Task: Update Product & Cart Data Model c94cea1
    - Update `Product` interface in `src/services/productService.ts`.
    - Update `CartItem` in `src/services/cartService.ts` to include `selectedSize` and `selectedColor`.
    - **Tests:** Update service tests to handle new fields.
- [x] Task: Update Product Detail UI 7de6389
    - Update `src/pages/ProductDetail.tsx` to render Size/Color selectors.
    - Validate selection before adding to cart.
    - **Tests:** Verify variant selectors appear and validation works.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Product Variants' (Protocol in workflow.md) 56a5035

## Phase 2: Footer & Homepage Polish
- [x] Task: Enhance Footer & Static Pages fca7f0b
    - Create `src/pages/Static/InfoPages.tsx` (generic component).
    - Update `src/components/layout/MainLayout.tsx` footer with links.
    - Add routes in `App.tsx`.
    - **Tests:** Verify navigation to info pages.
- [x] Task: Add Homepage Reviews 981e220
    - Update `src/pages/Home.tsx` to include a "Featured Reviews" section.
    - **Tests:** Verify reviews section renders.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Footer & Homepage Polish' (Protocol in workflow.md)

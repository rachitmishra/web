# Track Plan: Product Detail Page (PDP) & Real-time Cart

## Phase 1: Session Management & Cart Service [checkpoint: cebde30]
- [x] Task: Implement Session ID Utility 8a9ac08
    - Create `src/lib/session.ts` to manage a persistent UUID in `localStorage`.
    - **Tests:** Verify session ID is generated once and persisted.
- [x] Task: Create Real-time Cart Service 3116736
    - Implement `src/services/cartService.ts` with Firestore `onSnapshot` sync.
    - Support `addToCart`, `removeFromCart`, and `updateQuantity`.
    - **Tests:** Write unit tests for cart operations mocking Firestore snapshots.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Session Management & Cart Service' (Protocol in workflow.md)

## Phase 2: Product Detail Page (PDP) [checkpoint: 4c504e1]
- [x] Task: Enhance PDP UI Component 85569d3
    - Update `src/pages/ProductDetail.tsx` with description, price, and gallery.
    - Implement a local `QuantitySelector` component.
    - **Tests:** Verify rendering of all product details and initial quantity state.
- [x] Task: Integrate Add to Cart Logic 2c43c83
    - Connect the PDP "Add to Cart" button to the `cartService`.
    - **Tests:** Verify service call with correct product and quantity.
- [x] Task: Implement Related Products & Reviews Sections dfd43e6
    - Add UI sections for mock reviews and related product cards.
    - **Tests:** Verify display of these contextual areas.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Product Detail Page (PDP)' (Protocol in workflow.md)

## Phase 3: Shopping Cart UI & Header Integration
- [x] Task: Create Header Cart Icon & Badge 691188b
    - Update `MainLayout` or create a `Header` component.
    - Listen to `cartService` state to update the item count badge.
    - **Tests:** Verify badge reflects the number of items in the cart.
- [x] Task: Implement Mini-Cart Drawer d45dcda
    - Create `src/components/ui/MiniCart/MiniCart.tsx` (slide-out drawer).
    - Auto-open drawer when an item is added.
    - **Tests:** Verify drawer opens/closes and displays current cart items.
- [x] Task: Create Full Cart Page 3ca7e8e
    - Implement `src/pages/Cart.tsx` with route `/cart`.
    - Show line items, subtotal, and checkout CTA.
    - **Tests:** Verify quantity adjustments and subtotal calculation on the page.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Shopping Cart UI & Header Integration' (Protocol in workflow.md)

# Track Plan: Marketing & SEO

## Phase 1: Foundations & Services [checkpoint: 629f01a]
- [x] Task: Implement Promo Code Service 44b2b47
    - Create `src/services/promoService.ts` for Firestore CRUD operations on `promo_codes`.
    - Implement `validatePromoCode(code, cartTotal)` returning discount amount or error.
    - **Tests:** Verify discount calculations (percentage vs fixed) and minimum purchase rules.
- [x] Task: Create SEO Management Hook f303196
    - Implement `src/hooks/useSEO.ts` to dynamically update document title and meta tags.
    - **Tests:** Verify `document.title` and meta description update correctly in a browser-like environment.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundations & Services' (Protocol in workflow.md) f303196

## Phase 2: Storefront Integration
- [x] Task: Integrate Promo Codes into Cart & Checkout 1b1b782
    - Add promo code input to `src/pages/Cart.tsx`.
    - Update local state to show applied discount and new total.
    - Ensure discounted total is passed to Razorpay in `src/pages/Checkout.tsx`.
    - **Tests:** Verify the cart total updates correctly when a valid code is applied and clears on removal.
- [ ] Task: Apply SEO to Product and Category Pages
    - Integrate `useSEO` hook into `src/pages/ProductDetail.tsx`.
    - Integrate `useSEO` hook into `src/pages/Home.tsx` based on active category.
    - **Tests:** Verify head tags change correctly when navigating between products.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Storefront Integration' (Protocol in workflow.md)

## Phase 3: Admin Management & Assets
- [ ] Task: Create Admin Marketing Dashboard
    - Implement `src/pages/Admin/Marketing.tsx` for managing promo codes.
    - Add navigation link in the Admin Dashboard.
    - **Tests:** Verify CRUD operations for promo codes in the admin UI.
- [ ] Task: Static Asset Generation
    - Create `public/robots.txt`.
    - Implement a simple script to generate `public/sitemap.xml` based on current products.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Admin & Final Polish' (Protocol in workflow.md)

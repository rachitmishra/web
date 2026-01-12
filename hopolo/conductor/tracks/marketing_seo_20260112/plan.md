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

## Phase 2: Storefront Integration [checkpoint: c335b5e]
- [x] Task: Integrate Promo Codes into Cart & Checkout 1b1b782
    - Add promo code input to `src/pages/Cart.tsx`.
    - Update local state to show applied discount and new total.
    - Ensure discounted total is passed to Razorpay in `src/pages/Checkout.tsx`.
    - **Tests:** Verify the cart total updates correctly when a valid code is applied and clears on removal.
- [x] Task: Apply SEO to Product and Category Pages 8f89e74
    - Integrate `useSEO` hook into `src/pages/ProductDetail.tsx`.
    - Integrate `useSEO` hook into `src/pages/Home.tsx` based on active category.
    - **Tests:** Verify head tags change correctly when navigating between products.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Storefront Integration' (Protocol in workflow.md) 0fb566b

## Phase 3: Admin Management & Assets
- [x] Task: Create Admin Marketing Dashboard bc773e7
    - Implement `src/pages/Admin/Marketing.tsx` for managing promo codes.
    - Add navigation link in the Admin Dashboard.
    - **Tests:** Verify CRUD operations for promo codes in the admin UI.
- [x] Task: Static Asset Generation 825c495
    - Create `public/robots.txt`.
    - Implement a simple script to generate `public/sitemap.xml` based on current products.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Admin & Final Polish' (Protocol in workflow.md) 825c495

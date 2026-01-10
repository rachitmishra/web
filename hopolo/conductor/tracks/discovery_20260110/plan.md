# Track Plan: Storefront Home & Product Discovery

## Phase 1: Firebase Integration & Data Fetching [checkpoint: 971880d]
- [x] Task: Initialize Firebase and Firestore Service ed7ed07
    - Install `firebase` dependency.
    - Create `src/lib/firebase.ts` with configuration.
    - **Tests:** Write unit tests for a `productService` mocking Firestore to verify data mapping.
- [x] Task: Implement Product Fetching Logic fa00d0c
    - Create `src/services/productService.ts`.
    - Implement `fetchProducts` and `fetchCategories`.
    - **Tests:** Verify service handles success and error states.
- [~] Task: Conductor - User Manual Verification 'Phase 1: Firebase Integration & Data Fetching' (Protocol in workflow.md)

## Phase 2: Discovery UI Components [checkpoint: 960af31]
- [x] Task: Create Hero Component 9255c93
    - Implement `src/components/ui/Hero/Hero.tsx` and `.module.css`.
    - **Tests:** Verify rendering of promotion text and background.
- [x] Task: Create ProductCard Component 81cb9b7
    - Implement `src/components/ui/ProductCard/ProductCard.tsx` and `.module.css`.
    - Display Image, Name, Price, Rating, and "Add to Cart".
    - **Tests:** Verify all details are rendered correctly.
- [x] Task: Create CategoryTabs Component fd66c64
    - Implement `src/components/ui/CategoryTabs/CategoryTabs.tsx`.
    - **Tests:** Verify active tab state and click callback.
- [~] Task: Conductor - User Manual Verification 'Phase 2: Discovery UI Components' (Protocol in workflow.md)

## Phase 3: Homepage Assembly & Filtering
- [ ] Task: Implement Homepage with Grid and Filtering
    - Combine `Hero`, `CategoryTabs`, and a grid of `ProductCard`s.
    - Implement local state filtering logic based on selected tab.
    - **Tests:** Verify that switching tabs updates the visible products.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Homepage Assembly & Filtering' (Protocol in workflow.md)

## Phase 4: Routing to Product Detail Page (PDP)
- [ ] Task: Setup React Router and Product Route
    - Install `react-router-dom`.
    - Create a placeholder PDP at `src/pages/ProductDetail.tsx`.
    - Link `ProductCard` to the PDP route.
    - **Tests:** Verify clicking a card triggers navigation to the correct URL.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Routing to Product Detail Page (PDP)' (Protocol in workflow.md)

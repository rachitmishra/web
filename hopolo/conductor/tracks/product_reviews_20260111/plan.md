# Track Plan: Product Reviews & Ratings

## Phase 1: Review Service [checkpoint: 19229e8]
- [x] Task: Create Review Service 1924e68
    - Create `src/services/reviewService.ts`.
    - Implement `addReview` and `fetchReviews`.
    - **Tests:** Mock Firestore `addDoc` and `getDocs` to verify logic.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Review Service' (Protocol in workflow.md) 9e9ecb9

## Phase 2: Product Detail Integration
- [x] Task: Implement Review List UI aa26a2c
    - Update `src/pages/ProductDetail.tsx` to fetch and display reviews.
    - Replace hardcoded static reviews.
    - **Tests:** Verify reviews are rendered correctly.
- [ ] Task: Implement Add Review Form
    - Add a form to `ProductDetail.tsx` (or a sub-component).
    - Handle submission using `reviewService`.
    - Handle auth state (hide form if not logged in).
    - **Tests:** Verify form submission calls service.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Product Detail Integration' (Protocol in workflow.md)

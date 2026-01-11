# Track Plan: Product Reviews & Ratings

## Phase 1: Review Service
- [x] Task: Create Review Service 1924e68
    - Create `src/services/reviewService.ts`.
    - Implement `addReview` and `fetchReviews`.
    - **Tests:** Mock Firestore `addDoc` and `getDocs` to verify logic.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Review Service' (Protocol in workflow.md)

## Phase 2: Product Detail Integration
- [ ] Task: Implement Review List UI
    - Update `src/pages/ProductDetail.tsx` to fetch and display reviews.
    - Replace hardcoded static reviews.
    - **Tests:** Verify reviews are rendered correctly.
- [ ] Task: Implement Add Review Form
    - Add a form to `ProductDetail.tsx` (or a sub-component).
    - Handle submission using `reviewService`.
    - Handle auth state (hide form if not logged in).
    - **Tests:** Verify form submission calls service.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Product Detail Integration' (Protocol in workflow.md)

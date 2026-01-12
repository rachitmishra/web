# Track Plan: Seed Data & Test Accounts

## Phase 1: Seeder Logic
- [x] Task: Create Seeder Service 62370aa
    - Create `src/services/seederService.ts`.
    - Implement `seedCategories`, `seedProducts`, `seedPromoCodes`, `seedReviews`.
    - Use hardcoded data dictionaries.
    - **Tests:** Verify functions call `addDoc`/`setDoc` correctly (mocked).
- [x] Task: Create Admin Seed Page 0bb252c
    - Create `src/pages/Admin/SeedData.tsx`.
    - Add a "Seed Database" button that calls the service functions.
    - Display progress/success logs.
    - Add route `/admin/seed` in `App.tsx`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Seeder Logic' (Protocol in workflow.md)

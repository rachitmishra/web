# Track Plan: User Profile & Address Management

## Phase 1: Address Management
- [x] Task: Implement Add/Delete Address logic 03d62d8
    - Update `src/services/profileService.ts` to include `deleteAddress`.
    - Update `src/pages/Profile.tsx` to handle adding and deleting addresses.
    - Create a simple inline form for adding addresses.
    - **Tests:** Verify service calls and UI state updates for address CRUD.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Address Management' (Protocol in workflow.md)

## Phase 2: Order History
- [ ] Task: Implement Order History Fetching
    - Update `src/services/orderService.ts` to include `fetchOrdersByUserId`.
    - Update `src/pages/Profile.tsx` to fetch and display the user's orders.
    - **Tests:** Verify orders for the correct user are displayed.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Order History' (Protocol in workflow.md)

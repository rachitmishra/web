# Track Plan: User Profile & Address Management

## Phase 1: Address Management [checkpoint: b5b51f5]
- [x] Task: Implement Add/Delete Address logic 03d62d8
    - Update `src/services/profileService.ts` to include `deleteAddress`.
    - Update `src/pages/Profile.tsx` to handle adding and deleting addresses.
    - Create a simple inline form for adding addresses.
    - **Tests:** Verify service calls and UI state updates for address CRUD.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Address Management' (Protocol in workflow.md) cec2d01

## Phase 2: Order History
- [x] Task: Implement Order History Fetching d44fc3e
    - Update `src/services/orderService.ts` to include `fetchOrdersByUserId`.
    - Update `src/pages/Profile.tsx` to fetch and display the user's orders.
    - **Tests:** Verify orders for the correct user are displayed.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Order History' (Protocol in workflow.md) f6a72a5

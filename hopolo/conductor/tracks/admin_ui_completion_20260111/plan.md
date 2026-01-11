# Track Plan: Admin UI Completion

## Phase 1: Shipping Integration
- [x] Task: Connect Ship Button to Service 08dbc5d
    - Update `src/pages/Admin/OrderDetail.tsx` to call `createShippingOrder`.
    - Handle success/loading/error states.
    - Update order status to 'shipped' via `updateOrderStatus`.
    - **Tests:** Mock service calls and verify UI updates (button disabled, status badge changed).
- [x] Task: Display Tracking Info 08dbc5d
    - Update `OrderDetail.tsx` to show tracking ID and label URL if present.
    - **Tests:** Verify tracking info renders when available.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Shipping Integration' (Protocol in workflow.md) a648964

## Phase 2: Refund Integration
- [ ] Task: Connect Refund Button to Service
    - Update `src/pages/Admin/OrderDetail.tsx` to call `refundOrder`.
    - Add confirmation dialog.
    - Handle success/loading/error states.
    - Update order status to 'refunded'.
    - **Tests:** Mock service calls and verify UI updates.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Refund Integration' (Protocol in workflow.md)

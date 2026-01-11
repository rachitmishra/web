# Track Plan: Admin Order Management & Shipping Integration

## Phase 1: Admin Authorization & Core Dashboard [checkpoint: 098004e]
- [x] Task: Implement Admin Route Guard a1bb450
    - Write tests for RBAC redirection.
    - Implement `src/components/ui/Auth/AdminRoute.tsx` checking for `role: 'admin'` in Firestore.
- [x] Task: Create Orders Dashboard UI 4afa20f
    - Write tests for order table rendering.
    - Implement `src/pages/Admin/Orders.tsx` with sorting and filtering.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Admin Authorization & Core Dashboard' (Protocol in workflow.md) 50578ef

## Phase 2: Shipping & Financial Operations [checkpoint: 5a4a552]
- [x] Task: Integrate Shadowfax Shipping Service d6111a8
    - Create `src/services/shippingService.ts`.
    - Implement API call to Shadowfax for fulfillment.
    - **Tests:** Mock Shadowfax API to verify label retrieval.
- [x] Task: Implement Razorpay Refund Logic e945ef4
    - Create `src/services/paymentService.ts` (Admin extensions).
    - Implement `refundOrder` using Razorpay API.
    - **Tests:** Verify order status updates after refund.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Shipping & Financial Operations' (Protocol in workflow.md) a0e871b

## Phase 3: Analytics & Details [checkpoint: 0c9d9cd]
- [x] Task: Implement Order Detail View 920c152
    - Create `src/pages/Admin/OrderDetail.tsx`.
    - **Tests:** Verify rendering of customer and line item data.
- [x] Task: Create Analytics Overview Section 8cc3c3f
    - Implement calculation logic for total sales and AOV.
    - Display metrics in the dashboard.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Analytics & Details' (Protocol in workflow.md) e650dcc

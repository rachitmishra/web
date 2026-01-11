# Track Plan: Email Notification System

## Phase 1: Service Setup & Confirmation [checkpoint: a1586a7]
- [x] Task: Integrate Resend & Create Email Service 854f78b
    - Install `resend` SDK.
    - Create `src/services/emailService.ts`.
    - Implement `sendEmail` base function.
    - **Tests:** Mock Resend API to verify payload structure.
- [x] Task: Implement Order Confirmation Email ccc9868
    - Create `src/templates/orderConfirmation.ts` (HTML generator).
    - Update `orderService` (or `paymentService` webhook handler) to trigger this email on 'PAID'.
    - **Tests:** Verify email service is called with correct data when order is created/paid.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Service Setup & Confirmation' (Protocol in workflow.md) 6ebb1e9

## Phase 2: Delivery Feedback
- [x] Task: Implement Delivery Feedback Email ac4de7e
    - Create `src/templates/deliveryFeedback.ts`.
    - Update `adminService` or `orderService` to trigger this email when status updates to 'delivered'.
    - **Tests:** Verify email trigger on status change.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Delivery Feedback' (Protocol in workflow.md)

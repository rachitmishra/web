# Track Plan: Razorpay Checkout & Order Management

## Phase 1: Checkout Foundation & Order Summary [checkpoint: 61fac24]
- [x] Task: Create Checkout Page Layout & Summary ad74747
    - Write tests for order summary breakdown and totals.
    - Implement `src/pages/Checkout.tsx` with summary UI.
- [x] Task: Implement Address Selection & Management daafbf7
    - Write tests for fetching saved addresses and manual entry validation.
    - Implement Address section in Checkout page.
- [~] Task: Conductor - User Manual Verification 'Phase 1: Checkout Foundation & Order Summary' (Protocol in workflow.md)

## Phase 2: Razorpay Integration & Payment Flow [checkpoint: ae485d5]
- [x] Task: Integrate Razorpay SDK a220ec6
    - Write tests for SDK loading and modal triggering (mocked).
    - Implement Razorpay integration logic in the Checkout page.
- [x] Task: Handle Payment Success & Create Order 9e77c9d
    - Write tests for order creation logic in Firestore service.
    - Implement `src/services/orderService.ts` and handle success callbacks.
- [~] Task: Conductor - User Manual Verification 'Phase 2: Razorpay Integration & Payment Flow' (Protocol in workflow.md)

## Phase 3: Reliability & Success Experience
- [x] Task: Implement Webhook Verification aa45ebe
    - Write tests for Razorpay signature verification.
    - Implement `api/razorpay-webhook.ts` (Vercel Serverless Function).
- [ ] Task: Create Success Page & Finalize Cart
    - Write tests for success page rendering and cart clearing state.
    - Implement `src/pages/Success.tsx` and cart clear logic in `cartService`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Reliability & Success Experience' (Protocol in workflow.md)

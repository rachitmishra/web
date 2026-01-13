RFC — D2C Commerce Platform
Version: v1.2
Status: Approved for implementation

1. Objective
Build a production-ready commerce app that supports:
Clean storefront (homepage, PDP, cart)
Real-time cart using Firebase (Firestore)
Razorpay checkout
Order confirmation flow
User account management
Admin order + refund + shipping operations
Email notifications (order placed + delivery feedback)

2. Final Technology Stack
Frontend
Next.js (App Router)
Firebase Auth
Firebase Firestore (real-time cart)
Backend
Next.js API routes
Prisma + SQLite/Postgres (orders, payments, shipping, admin data)
Payments
Razorpay Checkout + Webhooks
Shipping
Shadowfax (manual trigger by admin)
Email
Resend / SendGrid
Hosting
Vercel

3. User-Facing Requirements (Aligned)
3.1 Homepage /
Notification banner
Header
Product grid
Review section (emoji summary)
Footer (Shipping policy, Contact, About us)

3.2 Product Detail Page /product/[slug]
Vertical image carousel
Size selector
Color options (for clothing)
Quantity selector
Add to cart
Emoji-based reviews (😊 😐 😞)

3.3 Cart Page /cart
Real-time cart updates
Edit quantity
Remove items
Place order
Razorpay checkout
Order created after payment success

3.4 Order Placed Page /order/success
Order number
Payment confirmation
Next steps

3.5 Account Profile /account
My Orders
Address management (add/edit/delete)

4. Admin Requirements
Admins are identified by:
UserProfile.role = ADMIN
Admin can:
View all successful orders
Manage order states
Refund orders via Razorpay
Create shipping in Shadowfax

5. Real-Time Cart with Firebase (NEW)

5.1 Why Firebase for Cart
The cart requires:
Instant sync across tabs/devices
Offline tolerance
Zero backend contention
Minimal latency
Firestore is ideal for this use case.

5.2 Cart Ownership Model
User Type
Cart Key
Logged-in user
cart:{firebase_uid}
Guest user
cart:{session_id}

When a guest logs in:
Guest cart is merged into user cart.

5.3 Firestore Data Model
Collection: carts
Document ID:
cart_{userId OR sessionId}
Schema
{
  "ownerId": "firebase_uid_or_session_id",
  "items": [
    {
      "productId": "prod_123",
      "variantId": "var_456",
      "designId": "design_789",
      "quantity": 2,
      "priceSnapshot": {
        "unit_base_price": 1000,
        "unit_discount_amount": 100,
        "unit_final_price_before_tax": 900,
        "unit_tax_amount": 108,
        "unit_final_price_after_tax": 1008
      }
    }
  ],
  "updatedAt": "timestamp"
}

5.4 Real-Time Sync Flow
User adds item
   ↓
Firestore write
   ↓
All open sessions receive update instantly
   ↓
Cart UI re-renders

5.5 Cart Operations
Action
Implementation
Add item
Firestore setDoc
Update qty
Firestore updateDoc
Remove item
Firestore arrayRemove
Clear cart
Firestore deleteDoc


5.6 Security Rules (conceptual)
match /carts/{cartId} {
  allow read, write:
    if request.auth != null
    && request.auth.uid == resource.data.ownerId;
}
For guests:
Access scoped to session token.

6. Checkout Flow (Updated)
Cart in Firestore
   ↓
User clicks Place Order
   ↓
Backend reads cart snapshot
   ↓
Create Order (CREATED)
   ↓
Open Razorpay checkout
   ↓
Payment success
   ↓
Webhook confirms
   ↓
Order.status = PAID
   ↓
Clear Firestore cart
   ↓
Send Order Confirmation Email

7. Email Notifications

7.1 Order Placed Email
Trigger: Order.status → PAID
Content:
Order number
Items summary
Amount paid
Shipping address
Support contact

7.2 Delivery Feedback Email
Trigger: Order.status → DELIVERED
Content:
Thank you message
Emoji feedback links
😊 Loved it
😐 Okay
😞 Not great
Feedback updates ProductReviewSummary.

8. Shipping Flow (Shadowfax)
Order PAID
   ↓
Admin clicks Create Shipment
   ↓
Backend calls Shadowfax API
   ↓
Fulfillment created
   ↓
Order READY_TO_SHIP
   ↓
Courier pickup
   ↓
Order SHIPPED → DELIVERED
   ↓
Send feedback email

9. Refund Flow
Admin clicks Refund
   ↓
Backend calls Razorpay Refund API
   ↓
Refund SUCCESS
   ↓
Payment.status = REFUNDED
   ↓
Order.status = REFUNDED
   ↓
Send refund email

10. System Architecture (Updated)
Browser
  ↓
Firebase Auth
  ↓
Next.js UI
  ↓
Firebase Firestore (Real-time Cart)
  ↓
Next.js API
  ↓
Prisma DB (Orders, Payments, Shipping)
  ↓
Razorpay
  ↓
Shadowfax
  ↓
Email Provider

11. Implementation Plan (Aligned)

Phase 1 — Foundations
Next.js setup
Firebase Auth
Firestore setup
Prisma schema

Phase 2 — Real-Time Cart
Firestore cart model
Cart hooks (useCart)
Guest → user cart merge

Phase 3 — Storefront
Homepage sections
Product page (carousel, size, color, reviews)
Cart page (real-time updates)

Phase 4 — Checkout
Create Order API
Razorpay checkout
Webhook handling
Order success page

Phase 5 — Account
Orders list
Address CRUD

Phase 6 — Admin
Orders dashboard
Status updates
Razorpay refunds
Shadowfax shipping creation

Phase 7 — Email System
Order confirmation email
Delivery feedback email
Email event logs

12. Acceptance Criteria
The system is complete when:
Homepage contains:
Banner
Header
Product grid
Reviews
Footer
Product page has:
Vertical carousel
Size + color
Reviews
Cart:
Updates in real-time
Supports quantity edits
Triggers Razorpay checkout
Order success page shows confirmation
Account page supports:
Orders
Addresses
Admin can:
View orders
Update status
Refund via Razorpay
Create shipping in Shadowfax
Customers receive:
Order confirmation email
Delivery feedback email


RFC ADDENDUM — Real-Time Cart, API Contracts, and Data Models
Status
Approved for inclusion in v1.3

1. Real-Time Cart (Firebase Firestore)
The system SHALL use Firebase Firestore for cart management.
Responsibilities
Persist cart state in real time
Sync across tabs/devices
Support guest and logged-in users
Provide offline tolerance
Data Model
Each cart SHALL be stored in the carts collection using:
cart_{firebase_uid}     // logged-in
cart_{session_id}      // guest
Schema:
ownerId
ownerType
items[]
priceSnapshot
updatedAt
Security
Access to cart documents SHALL be restricted by:
Firebase Auth UID (logged-in users)
Session token (guests)

2. Client Cart Abstraction
The frontend SHALL use a dedicated hook:
useCart(ownerId, ownerType)
Capabilities:
Subscribe to cart changes
Add / update / remove items
Clear cart after successful order
Merge guest cart into user cart on login

3. System of Record
Domain
System
Cart
Firebase Firestore
Auth
Firebase Auth
Orders
Prisma DB
Payments
Razorpay
Shipping
Shadowfax
Emails
Resend / SendGrid

Firestore is NOT the source of truth for orders — it is strictly for cart state.

4. Data Layer Standardization
The backend SHALL implement the Prisma schema defined in Appendix A.
This schema standardizes:
Pricing and tax
Orders and payments
Fulfillment
Admin control
Reviews

5. API Contracts
All checkout and admin operations SHALL conform to the OpenAPI specification defined in Appendix B.
Mandatory endpoints:
/api/orders
/api/payments/create
/api/webhooks/razorpay
/api/admin/orders
/api/admin/orders/{id}/status
/api/admin/orders/{id}/refund
/api/admin/orders/{id}/shipping

6. Acceptance Criteria (Updated)
The platform SHALL be considered complete when:
Cart updates in real time across sessions
Checkout uses Razorpay and creates persistent orders
Admin can:
View orders
Update order states
Refund payments
Create shipping in Shadowfax
Customers receive:
Order confirmation email
Delivery feedback email

7. Compliance
This RFC version (v1.3) supersedes all prior architecture decisions regarding cart management and API contracts.



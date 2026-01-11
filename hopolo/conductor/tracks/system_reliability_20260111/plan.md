# Track Plan: System Reliability & Logging

## Phase 1: Email Logging Service
- [x] Task: Implement Email Logging b69f2cb
    - Update `src/services/emailService.ts` to save logs to Firestore `mail_logs`.
    - Handle both success and failure cases.
    - **Tests:** Update `emailService.test.ts` to verify Firestore writes.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Email Logging Service' (Protocol in workflow.md)

## Phase 2: Admin Email Logs UI
- [ ] Task: Create Email Logs Page
    - Create `src/pages/Admin/EmailLogs.tsx`.
    - Fetch logs from Firestore using a new `fetchEmailLogs` service function.
    - Add navigation to this page from the main Admin Dashboard (or `Admin/Orders.tsx`).
    - **Tests:** Verify logs list rendering.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Admin Email Logs UI' (Protocol in workflow.md)

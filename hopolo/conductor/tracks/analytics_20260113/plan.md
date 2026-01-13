# Track Plan: Advanced Analytics & Reporting

## Phase 1: Data Processing & Foundations [checkpoint: b6d0273]
- [x] Task: Setup Recharts & Analytics Utilities b800e4b
    - Install `recharts` library.
    - Create `src/lib/analyticsUtils.ts`.
    - Implement aggregation functions: `aggregateRevenuePerDay`, `calculateTopProducts`, and `calculateCategoryShare`.
    - **Tests:** Write unit tests for data transformation logic using mock order datasets.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Data Processing & Foundations' (Protocol in workflow.md) b800e4b

## Phase 2: Visual Components [checkpoint: 5fffcc4]
- [x] Task: Create Reusable Chart Components b3725d6
    - Implement `RevenueAreaChart.tsx` for revenue trends.
    - Implement `TopProductsBarChart.tsx` for performance ranking.
    - Implement `CategoryDonutChart.tsx` for distribution.
    - **Tests:** Verify each component renders correctly with sample data.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Visual Components' (Protocol in workflow.md) b3725d6

## Phase 3: Dashboard Integration
- [ ] Task: Implement Analytics Dashboard Page
    - Create `src/pages/Admin/Analytics.tsx`.
    - Integrate range selection toggle (Today, 7D, 30D).
    - Connect real Firestore data from `orderService` to charts.
    - **Tests:** Verify data updates correctly when switching time ranges.
- [ ] Task: Update Admin Navigation
    - Add "Analytics" link to the Admin layout or dashboard header.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Dashboard Integration' (Protocol in workflow.md)

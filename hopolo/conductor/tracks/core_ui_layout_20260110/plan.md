# Track Plan: Initialize Core UI Components and Layout

## Phase 1: Foundation & Layout
- [x] Task: Define Global CSS Variables and Reset bac20e5
    - Define colors, spacing, and typography in `index.css` or `App.css`.
    - Ensure box-sizing is set to border-box globally.
- [ ] Task: Create MainLayout Component
    - Create `src/components/layout/MainLayout.tsx`.
    - Create `src/components/layout/MainLayout.module.css` (or similar).
    - Implement Header, Footer, and children rendering.
    - **Tests:** Verify Layout renders children and structural elements.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Layout' (Protocol in workflow.md)

## Phase 2: Core Components
- [ ] Task: Create Button Component
    - Create `src/components/ui/Button/Button.tsx`.
    - Create `src/components/ui/Button/Button.module.css`.
    - Implement variants (primary, secondary) and states (disabled, loading).
    - **Tests:** Verify click handling, class application for variants, and disabled state.
- [ ] Task: Create Input Component
    - Create `src/components/ui/Input/Input.tsx`.
    - Create `src/components/ui/Input/Input.module.css`.
    - Support labels and error messages.
    - **Tests:** Verify text entry, label rendering, and error display.
- [ ] Task: Create Card Component
    - Create `src/components/ui/Card/Card.tsx`.
    - Create `src/components/ui/Card/Card.module.css`.
    - **Tests:** Verify content rendering and basic styling classes.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Core Components' (Protocol in workflow.md)

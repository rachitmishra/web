# Track Plan: Refactor CSS Architecture

## Phase 1: Setup and Analysis
- [ ] Task: Create directory `src/styles/screens` to house the new CSS files.
- [ ] Task: Analyze `src/styles/components.css` and map CSS classes to their respective screens (Dashboard, Strategy, Flashcards, etc.).

## Phase 2: Extraction and Refactoring
- [ ] Task: Extract Dashboard styles
    - [ ] Sub-task: Create `src/styles/screens/dashboard.css`.
    - [ ] Sub-task: Move Dashboard-related styles from `components.css` to `dashboard.css`.
    - [ ] Sub-task: Import `dashboard.css` in `src/screens/Dashboard.tsx` or `src/index.css`.
- [ ] Task: Extract StrategyView styles
    - [ ] Sub-task: Create `src/styles/screens/strategy.css`.
    - [ ] Sub-task: Move Strategy-related styles from `components.css` to `strategy.css`.
    - [ ] Sub-task: Import `strategy.css` in `src/screens/StrategyView.tsx` or `src/index.css`.
- [ ] Task: Extract Flashcards styles
    - [ ] Sub-task: Create `src/styles/screens/flashcards.css`.
    - [ ] Sub-task: Move Flashcards-related styles from `components.css` to `flashcards.css`.
    - [ ] Sub-task: Import `flashcards.css` in `src/screens/Flashcards.tsx` or `src/index.css`.
- [ ] Task: Extract Scenarios styles
    - [ ] Sub-task: Create `src/styles/screens/scenarios.css`.
    - [ ] Sub-task: Move Scenarios-related styles from `components.css` to `scenarios.css`.
    - [ ] Sub-task: Import `scenarios.css` in `src/screens/Scenarios.tsx` or `src/index.css`.
- [ ] Task: Extract Result and Failure styles
    - [ ] Sub-task: Create `src/styles/screens/result.css` and `src/styles/screens/failure.css`.
    - [ ] Sub-task: Move relevant styles from `components.css`.
    - [ ] Sub-task: Import new CSS files in respective components.
- [ ] Task: Extract CertificateView styles
    - [ ] Sub-task: Create `src/styles/screens/certificate.css`.
    - [ ] Sub-task: Move relevant styles.
    - [ ] Sub-task: Import in `src/screens/CertificateView.tsx`.
- [ ] Task: Refine WordBank styles
    - [ ] Sub-task: Move `src/styles/wordbank.css` to `src/styles/screens/wordbank.css` (or ensure it's imported correctly).
    - [ ] Sub-task: Ensure no WordBank styles remain in `components.css`.

## Phase 3: Cleanup and Verification
- [ ] Task: Review `src/styles/components.css` for any shared/common components (e.g., Buttons, Headers) and rename/refactor as `common.css` or keep as `components.css` but clean.
- [ ] Task: Verify application build.
- [ ] Task: Conductor - User Manual Verification 'Cleanup and Verification' (Protocol in workflow.md)

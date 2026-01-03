# Track Plan: Refactor CSS Architecture

## Phase 1: Setup and Analysis
- [x] Task: Create directory `src/styles/screens` to house the new CSS files. c0da1ee
- [x] Task: Analyze `src/styles/components.css` and map CSS classes to their respective screens (Dashboard, Strategy, Flashcards, etc.). c0da1ee

## Phase 2: Extraction and Refactoring
- [x] Task: Extract Dashboard styles c0da1ee
    - [x] Sub-task: Create `src/styles/screens/dashboard.css`. c0da1ee
    - [x] Sub-task: Move Dashboard-related styles from `components.css` to `dashboard.css`. c0da1ee
    - [x] Sub-task: Import `dashboard.css` in `src/screens/Dashboard.tsx` or `src/index.css`. c0da1ee
- [x] Task: Extract StrategyView styles c0da1ee
    - [x] Sub-task: Create `src/styles/screens/strategy.css`. c0da1ee
    - [x] Sub-task: Move Strategy-related styles from `components.css` to `strategy.css`. c0da1ee
    - [x] Sub-task: Import `strategy.css` in `src/screens/StrategyView.tsx` or `src/index.css`. c0da1ee
- [x] Task: Extract Flashcards styles c0da1ee
    - [x] Sub-task: Create `src/styles/screens/flashcards.css`. c0da1ee
    - [x] Sub-task: Move Flashcards-related styles from `components.css` to `flashcards.css`. c0da1ee
    - [x] Sub-task: Import `flashcards.css` in `src/screens/Flashcards.tsx` or `src/index.css`. c0da1ee
- [x] Task: Extract Scenarios styles c0da1ee
    - [x] Sub-task: Create `src/styles/screens/scenarios.css`. c0da1ee
    - [x] Sub-task: Move Scenarios-related styles from `components.css` to `scenarios.css`. c0da1ee
    - [x] Sub-task: Import `scenarios.css` in `src/screens/Scenarios.tsx` or `src/index.css`. c0da1ee
- [x] Task: Extract Result and Failure styles c0da1ee
    - [x] Sub-task: Create `src/styles/screens/result.css` and `src/styles/screens/failure.css`. c0da1ee
    - [x] Sub-task: Move relevant styles from `components.css`. c0da1ee
    - [x] Sub-task: Import new CSS files in respective components. c0da1ee
- [x] Task: Extract CertificateView styles c0da1ee
    - [x] Sub-task: Create `src/styles/screens/certificate.css`. c0da1ee
    - [x] Sub-task: Move relevant styles. c0da1ee
    - [x] Sub-task: Import in `src/screens/CertificateView.tsx`. c0da1ee
- [x] Task: Refine WordBank styles c0da1ee
    - [x] Sub-task: Move `src/styles/wordbank.css` to `src/styles/screens/wordbank.css` (or ensure it's imported correctly). c0da1ee
    - [x] Sub-task: Ensure no WordBank styles remain in `components.css`. c0da1ee

## Phase 3: Cleanup and Verification
- [x] Task: Review `src/styles/components.css` for any shared/common components (e.g., Buttons, Headers) and rename/refactor as `common.css` or keep as `components.css` but clean. c0da1ee
- [x] Task: Verify application build. c0da1ee
- [x] Task: Conductor - User Manual Verification 'Cleanup and Verification' (Protocol in workflow.md) c0da1ee

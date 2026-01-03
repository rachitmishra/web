# Track Plan: Further UI Component Refactoring

## Phase 1: CSS Style Extraction
- [x] Task: Extract Button styles
    - [x] Sub-task: Create `src/styles/components/buttons.css`.
    - [x] Sub-task: Move `.btn` related styles from `components.css` to `buttons.css`.
    - [x] Sub-task: Import `buttons.css` in `src/index.css`.
- [x] Task: Extract Toast styles
    - [x] Sub-task: Create `src/styles/components/toasts.css`.
    - [x] Sub-task: Move `.feedback-toast`, `.custom-toast` and related content styles to `toasts.css`.
    - [x] Sub-task: Import `toasts.css` in `src/index.css`.
- [x] Task: Conductor - User Manual Verification 'CSS Style Extraction' (Protocol in workflow.md)

## Phase 2: Component Refactoring (IconSelect)
- [x] Task: Create new styles for IconSelect
    - [x] Sub-task: Create `src/styles/components/icon-select.css`.
    - [x] Sub-task: Identify and move styles from `LanguageSelector.tsx` or related CSS to `icon-select.css`.
- [x] Task: Refactor LanguageSelector to IconSelect
    - [x] Sub-task: Rename `src/components/LanguageSelector.tsx` to `src/components/IconSelect.tsx`.
    - [x] Sub-task: Update component to accept generic options (icon, label, value) and callback.
    - [x] Sub-task: Update all imports in `src/screens/Dashboard.tsx`, `src/screens/Flashcards.tsx`, etc., to use `IconSelect`.
- [x] Task: Conductor - User Manual Verification 'Component Refactoring' (Protocol in workflow.md)

## Phase 3: Cleanup and Final Integration
- [x] Task: Cleanup monolithic components.css
    - [x] Sub-task: Ensure no redundant styles remain.
    - [x] Sub-task: Verify all screen-specific styles are correctly imported.
- [x] Task: Final Build and Regression Check
    - [x] Sub-task: Verify application build.
    - [x] Sub-task: Perform manual verification of Buttons, Toasts, and the new IconSelect.
- [x] Task: Conductor - User Manual Verification 'Cleanup and Final Integration' (Protocol in workflow.md)

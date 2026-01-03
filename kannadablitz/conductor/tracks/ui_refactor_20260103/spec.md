# Track Specification: Further UI Component Refactoring

## Overview
This track focuses on further modularizing the application's UI by extracting core component styles (`btn`, `toast`) and refactoring the `LanguageSelector` into a more reusable `IconSelect` component. This continues the effort to improve maintainability and decouple styles from large monolithic files.

## Functional Requirements
- **Style Extraction:**
    - Extract all `.btn` related styles from `src/styles/components.css` into `src/styles/components/buttons.css`.
    - Extract all `.feedback-toast` and `.custom-toast` related styles from `src/styles/components.css` into `src/styles/components/toasts.css`.
- **Component Refactoring:**
    - Rename `src/components/LanguageSelector.tsx` to `src/components/IconSelect.tsx`.
    - Refactor the component to be generic (e.g., accepting options via props) while maintaining its current functionality for language selection.
    - Extract styles for this component into `src/styles/components/icon-select.css`.
- **Integration:**
    - Update all imports in `src/index.css` to include the new CSS files.
    - Update all component imports to use the renamed `IconSelect`.

## Non-Functional Requirements
- **Visual Consistency:** The visual appearance and behavior of buttons, toasts, and the selector must remain unchanged.
- **Organization:** Styles should be categorized under the `@layer components` layer where applicable.

## Acceptance Criteria
- `src/styles/components.css` is further reduced in size.
- New CSS files exist: `buttons.css`, `toasts.css`, `icon-select.css`.
- `IconSelect.tsx` replaces `LanguageSelector.tsx` successfully.
- Application builds and functions correctly with no styling regressions.

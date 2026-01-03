# Project Conventions & Standards

This document outlines the standard directory structure, naming conventions, and configuration patterns for our web application projects. Adhere to these rules to ensure consistency across the codebase.

## 1. Directory Structure (`src/`)

Organize the `src` directory as follows:

- **`components/`**: React components.
  - *Example:* `Button.tsx`, `Header.tsx`, `GameView.tsx`
- **`hooks/`**: Custom React hooks.
  - *Example:* `useProgress.ts`, `useAudioEngine.ts`
- **`data/`**: Static data, constants, and content.
  - *Example:* `gameData.ts`, `data_en.ts`
- **`types/`**: TypeScript interfaces and type definitions.
  - *Example:* `index.ts`, `types.ts`
- **`styles/`**: CSS and styling files.
  - *Structure:*
    - `reset.css`: Basic CSS reset.
    - `variables.css`: CSS variables (:root).
    - `base.css`: Tailwind `@base` and global element styles.
    - `components.css`: Tailwind `@components` and extracted component classes.
    - `utilities.css`: Tailwind `@utilities` and custom utility classes.
- **`context/`** (Optional): React Context providers.
  - *Example:* `AuthContext.tsx`
- **`utils/`** (Optional): Helper functions and utilities.
  - *Example:* `nameGenerator.ts`, `formatDate.ts`
- **`assets/`** (Optional): Static assets like images and fonts.

## 2. File Naming Conventions

- **React Components**: Use **PascalCase**.
  - `PianoKeyboard.tsx`, `UserProfile.tsx`
- **Hooks**: Use **camelCase** prefixed with `use`.
  - `useInputSystem.ts`, `useAuth.ts`
- **Data & Configuration**: Use **camelCase**.
  - `firebase.ts` (not `firebaseConfig.ts`)
  - `gameData.ts`
- **Types**: Use **camelCase** or `index.ts` for aggregated exports.
  - `index.ts`, `userTypes.ts`
- **Styles**: Use **kebab-case** or **camelCase** (consistency within project).
  - `variables.css`, `components.css`

## 3. Configuration & Libraries

- **Firebase**:
  - Configuration file should be named `src/firebase.ts`.
  - Use `firebase.json` for hosting configuration.
- **Tailwind CSS**:
  - Use specific CSS files in `src/styles/` imported in `src/main.tsx` or `src/index.tsx`.
  - Avoid large inline class strings for complex components; extract to `src/styles/components.css` using `@layer components` and `@apply`.
- **TypeScript**:
  - strict mode enabled.
  - Explicit interfaces for props and state.

## 4. Coding Patterns

- **State Management**:
  - Prefer custom hooks (`src/hooks/`) to encapsulate complex logic and state, keeping UI components clean.
  - Use Context for global state (Auth, Theme).
- **Imports**:
  - Use relative paths (e.g., `../components/Button`) or configured aliases if available.

# Track Specification: Refactor CSS Architecture

## Goal
The goal of this track is to improve the maintainability and organization of the project's CSS by breaking down the large `components.css` and `wordbank.css` files into smaller, screen-specific CSS files. This will align the styling structure with the recently refactored `src/screens` directory.

## Scope
- Analyze `src/styles/components.css` and `src/styles/wordbank.css` to identify styles belonging to specific screens.
- Create new CSS files in `src/styles/screens/` (or similar) corresponding to each screen component:
    - `Dashboard.css`
    - `StrategyView.css`
    - `Flashcards.css`
    - `Scenarios.css`
    - `Result.css`
    - `Failure.css`
    - `CertificateView.css`
    - `WordBank.css` (refine existing or move)
- Update the import statements in the corresponding Screen components (or `index.css`/`App.tsx` depending on current architecture) to use these new files.
- Verify that the visual appearance of the application remains unchanged.

## Success Criteria
- `src/styles/components.css` is significantly reduced in size or deprecated if fully migrated.
- New CSS files exist for each major screen.
- The application builds and runs without styling regressions.
- Codebase follows the project's style guidelines.

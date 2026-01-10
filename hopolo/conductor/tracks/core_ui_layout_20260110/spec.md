# Track Spec: Initialize Core UI Components and Layout

## Goal
Establish the foundational UI architecture for Hopolo by creating a responsive layout shell and a set of reusable core components (Button, Input, Card). This track explicitly avoids Tailwind CSS, favoring standard CSS Modules or plain CSS for styling to maintain full control over the design system.

## Requirements

### 1. Global Styling & Reset
- Define CSS variables for the color palette, typography, and spacing (based on Product Guidelines).
- Ensure a consistent box-sizing reset.
- Set up global font styles.

### 2. Layout Architecture
- **MainLayout Component:**
  - Responsive container structure.
  - **Header:** Contains logo (text/placeholder) and navigation placeholder.
  - **Footer:** Copyright and links placeholder.
  - **Main Content Area:** Flexible growing region.

### 3. Core Components
- **Button:**
  - Variants: Primary, Secondary, Outline.
  - States: Hover, Active, Disabled, Loading.
- **Input:**
  - Standard text input with label and error state support.
- **Card:**
  - Generic container with consistent padding, border-radius, and shadow.

## Technical Constraints
- **Styling:** CSS Modules (`*.module.css`) or standard CSS (`*.css`). **NO TAILWIND CSS.**
- **Framework:** React (Vite).
- **Language:** TypeScript.
- **Testing:** Unit tests for all components.

## Success Criteria
- Global styles are applied.
- `MainLayout` wraps the application content correctly.
- `Button`, `Input`, and `Card` components are rendered in a "Showcase" or demo page (or just verifiable via tests/Storybook if available, but for now simple rendering is fine).
- All components pass unit tests.
- Responsive design works on Mobile and Desktop.

# Implementation Plan: Offline Support

## Phase 1: Project Setup (Testing & PWA)
- [x] Task 1: Setup Testing Environment e967e70
    - Install `vitest`, `@testing-library/react`, `jsdom`, and `@testing-library/jest-dom`.
    - Update `vite.config.ts` to include `test` configuration.
    - Create a test setup file.
- [ ] Task 2: Install and Configure `vite-plugin-pwa`
    - Install `vite-plugin-pwa`.
    - Configure the plugin in `vite.config.ts` with a basic manifest and `registerType: 'autoUpdate'`.
    - Define `workbox` strategies for caching fonts and images.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Project Setup' (Protocol in workflow.md)

## Phase 2: Offline Data Persistence
- [ ] Task 3: Enable Firestore Persistence
    - Update `src/firebase.ts` to enable `enableMultiTabPersistentCache` for Firestore.
    - Handle potential initialization errors (e.g., if persistence is already enabled or unsupported).
- [ ] Task 4: Implement Connectivity Hook
    - Create a `useOnlineStatus` custom hook to track `navigator.onLine`.
    - Write unit tests for the hook.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Offline Data Persistence' (Protocol in workflow.md)

## Phase 3: UI/UX & Social Features
- [ ] Task 5: Social Panel Read-Only Mode
    - Modify `SocialPanel.tsx` and `FriendItem.tsx` to accept an `isOffline` prop (from `useOnlineStatus`).
    - Disable nudge buttons and add-friend functionality when `isOffline` is true.
    - Add a subtle offline indicator (e.g., a "cloud-off" icon) to the Social Panel header.
- [ ] Task 6: Dashboard Offline Indicators
    - Add a small connectivity status indicator to the `Header` or `Dashboard`.
    - Write tests to ensure UI components react correctly to online/offline state changes.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI/UX & Social Features' (Protocol in workflow.md)

## Phase 4: Verification & PWA Testing
- [ ] Task 7: Production Build Verification
    - Run `npm run build` and `npm run preview`.
    - Verify Service Worker registration in the browser's DevTools.
    - Test "offline" mode using Chrome DevTools network throttling.
- [ ] Task 8: Sync Verification
    - Simulate playing a level offline (checking if progress is saved to IndexedDB).
    - Restore connection and verify that progress is synced to the Firestore emulator or production database.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Verification' (Protocol in workflow.md)

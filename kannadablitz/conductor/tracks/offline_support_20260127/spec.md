# Specification: Offline Support

## Overview
Enable KannadaBlitz to function offline, allowing users to continue their learning journey without a constant internet connection. This includes caching the application shell/assets and ensuring gameplay progress is saved and synchronized when the connection is restored.

## Functional Requirements
- **App Shell Caching:** All static assets (HTML, CSS, JS, Fonts, Images) must be cached using a Service Worker to allow the app to load without an internet connection.
- **Offline Gameplay:** Users must be able to:
    - Access and play available levels (Daily Challenge, Practice Mode, Scenarios).
    - Earn badges and update their streak while offline.
    - View their Dashboard and Word Bank using cached data.
- **Data Persistence & Sync:** 
    - Use Firestore's persistent cache to store user progress locally.
    - Automatically synchronize local changes with the Firebase backend once connectivity is restored.
- **Social Features (Offline Mode):**
    - The Social Panel should display the last known state of friends and nudges.
    - Interaction (sending nudges, adding friends) should be disabled when offline.
- **UI/UX Indicators:**
    - Provide subtle contextual indicators (e.g., a "cloud-off" icon) to inform the user when they are viewing cached data or when certain features are unavailable due to being offline.

## Non-Functional Requirements
- **Performance:** App load time from cache should be faster than a full network load.
- **Reliability:** Progress must not be lost when switching between online and offline states.
- **Compatibility:** Offline support should work on modern browsers (Chrome, Safari, Firefox) and mobile devices.

## Implementation Details
- **Technology:** `vite-plugin-pwa` for Service Worker generation and asset manifest.
- **Database:** Enable Firestore persistence (`enableMultiTabPersistentCache` for modern browsers).

## Acceptance Criteria
- [ ] The app loads successfully when the device is in Airplane Mode.
- [ ] A user can complete a level while offline and see their streak/XP update in the UI.
- [ ] After going back online, the progress made offline is reflected in the Firestore database.
- [ ] The Social Panel remains visible but shows a "Read-only" or "Offline" status indicator.
- [ ] Interactive buttons in the Social Panel are disabled during offline sessions.

## Out of Scope
- Queuing social actions (e.g., sending a nudge while offline and having it send later).
- Offline account recovery (requires server-side validation).

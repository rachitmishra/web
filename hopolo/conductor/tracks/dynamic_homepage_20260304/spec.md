# Specification: Fully Dynamic Homepage Configuration

## Overview
Currently, several key elements of the Hopolo homepage are hardcoded in `Home.tsx` (Cinematic Hero image, title, subtitle, CTA) or `BestSellers.tsx` (static reviews). This track aims to move these configurations into a central Firestore-backed settings document (`settings/storefront`) and provide an admin interface to manage them.

## Goals
- Move Hero section content (title, subtitle, image, CTA) to Firestore.
- Move customer reviews to Firestore.
- Update the Admin Storefront page to allow editing these new fields.
- Ensure the Homepage updates in real-time or upon refresh when settings change.

## Technical Changes

### 1. Data Model Update
Update the `StorefrontSettings` interface in `src/services/storefrontService.ts`:
```typescript
export interface CustomerReview {
  name: string;
  emoji: string;
  text: string;
}

export interface StorefrontSettings {
  // Existing
  bannerText: string;
  bannerColor: string;
  bannerLink: string;
  bannerVisible: boolean;
  isMaintenanceMode: boolean;
  
  // New
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaText: string;
  reviews: CustomerReview[];
}
```

### 2. Service Layer
- Update `getStorefrontSettings` to handle new fields.
- Update `updateStorefrontSettings` to handle partial updates.

### 3. Admin Interface
- Update `src/pages/Admin/Storefront.tsx` to include form sections for:
    - **Hero Configuration:** Inputs for Title, Subtitle, Image URL, and CTA Text.
    - **Reviews Management:** A list of reviews with the ability to edit/add/remove.

### 4. Homepage Integration
- Update `src/pages/Home.tsx` to:
    - Load settings using `getStorefrontSettings` (or use the existing subscription if applicable).
    - Pass dynamic values to `CinematicHero`.
    - Map through dynamic `reviews` instead of the hardcoded array.

## Acceptance Criteria
- [ ] Admin can change the Hero Title and see it reflected on the Homepage.
- [ ] Admin can change the Hero Image URL.
- [ ] Admin can add/edit/delete customer reviews.
- [ ] Default values are provided if settings are missing in Firestore.
- [ ] All changes are covered by unit tests (TDD approach).

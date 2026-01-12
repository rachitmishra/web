# Track Plan: Admin Inventory Management

## Phase 1: Data Model & Storage Foundations
- [x] Task: Update Firestore Schema & Product Service 47b4ba0
    - Refactor `Product` interface in `src/services/productService.ts` to include new fields (variants, delivery, specs, etc.).
    - Implement `Variant` interface.
    - **Tests:** Write tests for new product fetching logic ensuring variants and rich details are handled.
- [~] Task: Setup Firebase Storage Service
    - Create `src/services/storageService.ts` for handling image uploads.
    - Implement `uploadProductImages(files: File[])` returning URLs.
    - **Tests:** Mock Firebase Storage to verify upload flow and URL retrieval.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Data Model & Storage Foundations' (Protocol in workflow.md)

## Phase 2: Core Admin Inventory UI [checkpoint: d38192c]
- [x] Task: Create Inventory Dashboard 19ef394
    - Implement `src/pages/Admin/Inventory.tsx` showing a table of all products with edit/delete actions.
    - **Tests:** Verify product list rendering.
- [x] Task: Implement Add/Edit Product Form (Core Details) 19ef394
    - Create multi-section form using CSS Modules.
    - Implement sections for: Core Details (Title, Price, Discount), Category Selection (with dynamic add).
    - **Tests:** Verify form validation and submission for core fields.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Core Admin Inventory UI' (Protocol in workflow.md) 19ef394

## Phase 3: Variants & Media Integration
- [x] Task: Implement Variant Management UI 19ef394
    - Add section to the product form to dynamically add/remove Size/Color/Stock combinations.
    - **Tests:** Verify variant data correctly updates local form state.
- [x] Task: Implement Media Upload UI 084b40c
    - Add image dropzone/uploader using `storageService`.
    - Show upload progress and preview of uploaded images.
    - **Tests:** Verify image association with product document on save.
- [x] Task: Finalize Product Save/Update Logic 57f0ea7
    - Update `productService` to include `saveProduct(productData)` and `updateProduct(id, productData)`.
    - **Tests:** Verify Firestore write operations for full product document including variants sub-collections if applicable.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Variants & Media Integration' (Protocol in workflow.md)

## Phase 4: Polish & Storefront Alignment
- [ ] Task: Update Storefront PDP for New Schema
    - Update `src/pages/ProductDetail.tsx` to utilize the rich new data (Delivery details, Art details, etc.).
    - **Tests:** Verify rendering of new detail sections.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Polish & Storefront Alignment' (Protocol in workflow.md)

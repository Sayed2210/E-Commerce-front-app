# Implementation Plan: API Integration Gaps ✅ COMPLETED

This document outlines the frontend changes needed to fully integrate with the Swagger API (72 endpoints).

**Status:** All items implemented on 2025-04-25

## Priority Legend

- 🟢 **High** — Core features missing that block users
- 🟡 **Medium** — Admin features that should exist
- 🔵 **Low** — Nice-to-have features

---

## 1. High Priority

### 1.1 Brand Management

- [x] Create `app/composables/useBrands.ts`
  - `listBrands(params?)` — `GET /brands`
  - `getBrand(id)` — `GET /brands/{id}`
  - `createBrand(dto)` — `POST /brands`
  - `updateBrand(id, dto)` — `PATCH /brands/{id}`
  - `deleteBrand(id)` — `DELETE /brands/{id}`
- [x] Create `app/pages/admin/brands/index.vue` — Brand CRUD page for admin
- [x] Update products catalog page to add brand filter dropdown
- [x] Add brand management to admin product create/edit forms

### 1.2 Tag Management

- [x] Create `app/composables/useTags.ts`
  - `listTags(params?)` — `GET /tags`
  - `createTag(dto)` — `POST /tags`
  - `deleteTag(id)` — `DELETE /tags/{id}`
- [x] Create `app/pages/admin/tags/index.vue` — Tag management page

### 1.3 Fix `useAdmin` Missing `updateStaff`

- [x] Add `updateStaff(id, dto)` to `app/composables/useAdmin.ts`
- [x] Add admin UI to edit staff members

---

## 2. Medium Priority

### 2.1 Product Image Management

- [x] Create `app/composables/useProductImages.ts`
  - `uploadImage(productId, file)` — `POST /products/{id}/images`
  - `deleteImage(productId, imageId)` — `DELETE /products/{id}/images/{imageId}`
  - `setPrimary(productId, imageId)` — `PATCH /products/{id}/images/{imageId}/primary`
- [x] Update `app/pages/admin/products/create.vue` to include image upload
- [x] Add image gallery management to product edit view

### 2.2 Newsletter Admin Panel

- [x] Create `app/composables/useNewsletterAdmin.ts`
  - `getStats()` — `GET /newsletter/stats`
  - `sendCampaign(dto)` — `POST /newsletter/send`
- [x] Create `app/pages/admin/newsletter/index.vue`
  - Campaign stats dashboard
  - Send campaign form

---

## 3. Low Priority

### 3.1 Search Reindex Tool

- [x] Create `app/pages/admin/search/index.vue`
- [x] Add button to trigger `POST /search/reindex`
- [x] Show reindex status/progress

### 3.2 Category Management (Admin)

- [x] Ensure `app/pages/admin/categories` exists (if API has CRUD)
- [x] Create `useCategoriesAdmin` composable if needed

---

## Files Modified

| File                                          | Change                          |
| --------------------------------------------- | ------------------------------- |
| `app/composables/useAdmin.ts`                 | Added `updateStaff` function    |
| `app/components/admin/coupons/CouponForm.vue` | Fixed prop mutation lint errors |

---

## Files Created

### Composables

- `app/composables/useBrands.ts`
- `app/composables/useTags.ts`
- `app/composables/useProductImages.ts`
- `app/composables/useNewsletterAdmin.ts`

### Pages

- `app/pages/admin/brands/index.vue`
- `app/pages/admin/tags/index.vue`
- `app/pages/admin/newsletter/index.vue`
- `app/pages/admin/search/index.vue`

---

## Remaining Tasks

- Product-tag assignment is not implemented because the Swagger API exposes tag CRUD but no product tag assignment field or endpoint.

---

## Notes

- Profile update and password change already implemented in `/account`
- Coupons list already implemented in `/admin/coupons`
- Run `npm run tokens:check` after any CSS changes
- Run `npm test` after code changes
- Run `npm run lint` before committing

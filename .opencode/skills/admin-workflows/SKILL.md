---
name: admin-workflows
description: Build or modify admin dashboard workflows for products, orders, coupons, returns, brands, tags, search, and newsletter management.
compatibility: opencode
metadata:
  app: ecommerce-front-app
  area: admin
---

## When To Use

Use this skill for pages under `app/pages/admin/`, admin components under `app/components/admin/`, admin composables, and role-protected admin flows.

## Admin Structure

- Admin pages live under `app/pages/admin/`.
- Admin layout is `app/layouts/admin.vue`.
- Admin route protection uses `app/middleware/admin.ts`.
- Admin components live under `app/components/admin/`.
- Admin table/data helpers live in `app/composables/admin/`.
- Shared admin components include `StatusBadge`, `DataTableSkeleton`, and `DataTablePagination`.

## Implementation Rules

- Preserve existing table/list patterns for loading, empty state, pagination, filtering, and row actions.
- Use the same authenticated API layer as the customer app: `useApiClient()`.
- Keep status color logic centralized in `app/composables/admin/useStatusColors.ts` when possible.
- Keep component filenames globally unique even across admin subfolders.
- Prefer extending existing composables such as `useAdmin`, `useCoupons`, `useBrands`, `useTags`, and admin table data helpers before adding new abstractions.

## Verification

- Run targeted tests for changed composables or middleware when present.
- For dashboard/table changes, run `npm run lint` and consider `npm run build` because admin routes are page-level Nuxt code.
- If status behavior changes, run `npx vitest tests/composables/admin/useStatusColors.test.ts`.

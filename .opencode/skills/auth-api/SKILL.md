---
name: auth-api
description: Work on authentication, protected API calls, token cookies, route guards, and role-based access in this Nuxt e-commerce frontend.
compatibility: opencode
metadata:
  app: ecommerce-front-app
  area: auth
---

## When To Use

Use this skill for login, register, logout, user fetch, password reset, email verification, admin login, protected routes, token handling, or API refresh behavior.

## Auth Layers

- `app/utils/token.ts` handles raw SSR-safe cookie read/write.
- `app/stores/auth.ts` holds auth state in Pinia.
- `app/composables/useAuth.ts` exposes login, register, logout, and fetch user behavior.
- `app/utils/api.ts` provides `useApiClient()` for authenticated calls with auto-refresh.
- `app/middleware/auth.ts`, `app/middleware/admin.ts`, and `app/middleware/guest.ts` protect routes.
- Admin access uses the same user endpoints plus role checks in `useAuth.ts`.

## Implementation Rules

- Do not duplicate token parsing or cookie behavior outside `app/utils/token.ts`.
- Prefer fixing auth state flow in the store/composable layer rather than patching pages.
- Use `useApiClient()` for authenticated API calls so refresh behavior stays consistent.
- Keep route middleware SSR-safe and deterministic.
- Avoid adding compatibility branches unless persisted tokens, shipped behavior, or external API consumers require it.
- Check `app/types/auth.ts` and `app/types/api.ts` before introducing new response shapes.

## Verification

- Token changes: run `npx vitest tests/utils/token.test.ts`.
- Store changes: run `npx vitest tests/stores/auth.test.ts`.
- Composable changes: run `npx vitest tests/composables/useAuth.test.ts` plus related password or verification tests.
- Middleware changes: run the matching files in `tests/middleware/`.
- For full confidence, run `npm run lint` and `npm test`.

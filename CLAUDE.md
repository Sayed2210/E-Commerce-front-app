# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run preview      # Preview production build

npm test             # Run all tests (Vitest)
npm run test:watch   # Watch mode
npm run test:ui      # Vitest UI
npm run test:coverage # Coverage report (v8 provider)
```

To run a single test file:

```bash
npx vitest tests/stores/auth.test.ts
```

## Environment

Create a `.env` file before running:

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

`NUXT_PUBLIC_API_BASE_URL` is required. `NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is required for Stripe payments (leave empty to disable the Stripe card element).

## Architecture

**Nuxt 4** app with the `app/` directory convention. Key modules: `@nuxt/ui` (component library + Tailwind v4), `@pinia/nuxt`, `@nuxt/image`, `@nuxt/scripts`.

### Auth Flow

Authentication is the primary feature. The layers are:

1. **`app/utils/token.ts`** — Low-level: reads/writes JWT tokens as cookies (`access_token` / `refresh_token`). Uses Nuxt's `useCookie` (SSR-safe). Access token expires in 1 day, refresh in 7 days.

2. **`app/stores/auth.ts`** — Pinia store holding `user: User | null` and `loading: boolean`. Getters: `isAuthenticated`, `isAdmin` (checks `roles.includes('ADMIN')`), `currentUser`.

3. **`app/composables/useAuth.ts`** — The main composable consumed by pages. Wraps `login()`, `register()`, `logout()`, `fetchUser()`. Calls `useFetch` directly against `apiBaseUrl`. After login, redirects to `/admin` or `/` based on role.

4. **`app/utils/api.ts`** — `useApiClient()` composable for authenticated requests with automatic token refresh. On 401, attempts refresh via `POST /auth/refresh`, then retries. On refresh failure, clears tokens and redirects to `/login`.

5. **`app/middleware/`** — Three route middlewares:
   - `auth.ts` — requires a valid access token cookie; redirects to `/login?redirect=<path>` if missing
   - `admin.ts` — requires admin role
   - `guest.ts` — redirects authenticated users away from login/register pages

### Dual Auth System

Admin and user auth share the same backend endpoints but differ in role checking. Admin login passes `isAdmin = true` to `useAuth().login()`, which verifies `roles.includes('ADMIN')`. Admin pages live under `app/pages/admin/` and use the `admin` layout (`app/layouts/admin.vue`). User pages use `app/layouts/default.vue`.

### Form Validation

All forms use **Zod** schemas defined in `app/utils/validation.ts` (`loginSchema`, `registerSchema`). These are integrated with `@nuxt/ui` form components.

### Testing

Tests live in `tests/` mirroring the `app/` structure: `tests/stores/`, `tests/composables/`, `tests/utils/`. The vitest config (`vitest.config.ts`) uses `@nuxt/test-utils` with `environment: 'nuxt'` and aliases `~` and `@` to `app/`. Mocks are in `tests/mocks/`.

### Backend API Contract

Expected endpoints at `NUXT_PUBLIC_API_BASE_URL`:

| Method | Path             | Purpose                                          |
| ------ | ---------------- | ------------------------------------------------ |
| POST   | `/auth/login`    | Returns `{ user, accessToken, refreshToken }`    |
| POST   | `/auth/register` | Returns `{ user, accessToken, refreshToken }`    |
| POST   | `/auth/refresh`  | Body: `{ refreshToken }`, returns new token pair |
| POST   | `/auth/logout`   | No body                                          |
| GET    | `/users/me`      | Returns `User` object (requires Bearer token)    |

`User` type: `{ id, email, firstName?, lastName?, roles: UserRole[], createdAt, updatedAt }` where `UserRole` is `'ADMIN' | 'CUSTOMER'`.

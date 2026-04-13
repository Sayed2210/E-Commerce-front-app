# E-Commerce Frontend App — QWEN.md

## Project Overview

This is a **Nuxt 4** (v4.2.2) e-commerce frontend application with a **dual authentication system** supporting both **admin** and **customer** user roles. It communicates with a NestJS backend API (typically at `http://localhost:3000`).

### Key Technologies

| Category         | Technology                                          |
| ---------------- | --------------------------------------------------- |
| Framework        | **Nuxt 4** (Vue 3, Composition API)                 |
| UI Library       | **@nuxt/ui** (Tailwind CSS v4)                      |
| State Management | **Pinia** (`@pinia/nuxt`)                           |
| Form Validation  | **Zod**                                             |
| Testing          | **Vitest** + `@nuxt/test-utils` + `@vue/test-utils` |
| Linting          | **ESLint 9** with `@nuxt/eslint`                    |
| Language         | **TypeScript**                                      |
| CSS              | **Tailwind CSS v4**                                 |

### Architecture Highlights

- Uses the **Nuxt 4 `app/` directory** convention (migrated from root-level structure)
- **SSR-safe authentication** via HTTP-only cookies (`access_token` / `refresh_token`)
- **Automatic token refresh** — when access token expires, a refresh is attempted via `POST /auth/refresh`
- **Role-based access control (RBAC)** — admin routes check `roles.includes('ADMIN')`
- **Multi-language support** — product/category content uses JSONB with `en`/`ar` keys
- **Custom fonts** — Work Sans + Plus Jakarta Sans via Google Fonts

---

## Directory Structure

```
E-Commerce-front-app/
├── app/                          # Nuxt 4 app directory (all application code)
│   ├── app.vue                   # Root component
│   ├── composables/
│   │   └── useAuth.ts            # Main auth composable (login, register, logout, fetchUser)
│   ├── layouts/
│   │   ├── admin.vue             # Admin dashboard layout
│   │   └── default.vue           # User/customer website layout
│   ├── middleware/
│   │   ├── auth.ts               # Requires authentication → redirects to /login if missing
│   │   ├── admin.ts              # Requires ADMIN role
│   │   └── guest.ts              # Redirects authenticated users away from login/register
│   ├── pages/
│   │   ├── admin/                # Admin pages (login, dashboard, products)
│   │   ├── account/index.vue     # User account page
│   │   ├── index.vue             # Homepage
│   │   ├── login.vue             # User login
│   │   └── register.vue          # User registration
│   ├── stores/
│   │   └── auth.ts               # Pinia store (user state, isAuthenticated, isAdmin)
│   ├── styles/
│   │   └── main.css              # Global styles
│   ├── types/
│   │   └── auth.ts               # TypeScript type definitions
│   └── utils/
│       ├── api.ts                # API client composable with auto-refresh logic
│       ├── errorHandler.ts       # Error handling utilities
│       ├── token.ts              # Cookie-based token read/write utilities
│       └── validation.ts         # Zod schemas (loginSchema, registerSchema)
├── tests/                        # Unit tests (mirrors app/ structure)
│   ├── composables/
│   ├── mocks/
│   ├── stores/
│   └── utils/
├── public/                       # Static assets
├── nuxt.config.ts                # Nuxt configuration
├── vitest.config.ts              # Vitest config (path aliases: ~ → app/)
├── tsconfig.json                 # TypeScript config (references .nuxt/ generated configs)
├── eslint.config.mjs             # ESLint config
├── package.json                  # Dependencies & scripts
└── .env.example                  # Environment variable template
```

---

## Building and Running

### Prerequisites

- Node.js (LTS recommended)
- Backend API running at `NUXT_PUBLIC_API_BASE_URL` (default: `http://localhost:3000`)

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and set NUXT_PUBLIC_API_BASE_URL if needed
```

### Development

```bash
npm run dev          # Start dev server at http://localhost:3000
```

### Production

```bash
npm run build        # Production build (with 4GB memory limit)
npm run preview      # Preview production build
npm run generate     # Static site generation
```

### Testing

```bash
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:ui      # Vitest UI
npm run test:coverage # Coverage report

# Run a single test file
npx vitest tests/stores/auth.test.ts
```

### Postinstall

```bash
npm run postinstall  # Runs `nuxt prepare` automatically after `npm install`
```

---

## Authentication System

### Flow

```
Register → Login → { accessToken, refreshToken, user }
                        ↓
            Use accessToken in API requests
                        ↓
            On 401 → POST /auth/refresh (with refreshToken)
                        ↓
            On refresh failure → clear tokens → redirect /login
```

### Token Details

| Token         | Cookie Name     | Lifetime | Purpose                       |
| ------------- | --------------- | -------- | ----------------------------- |
| Access Token  | `access_token`  | 1 day    | API authentication            |
| Refresh Token | `refresh_token` | 7 days   | Refresh expired access tokens |

### Key Composables

```typescript
// In any component:
const { user, isAuthenticated, isAdmin, login, register, logout, fetchUser } = useAuth()

// For authenticated API calls:
const apiClient = useApiClient()
const response = await apiClient('/some-endpoint')
```

### Protecting Routes

```vue
<!-- Requires authentication -->
<script setup>
definePageMeta({ middleware: 'auth' })
</script>

<!-- Requires admin role -->
<script setup>
definePageMeta({ middleware: 'admin' })
</script>

<!-- Guest-only (redirects if already authenticated) -->
<script setup>
definePageMeta({ middleware: 'guest' })
</script>
```

---

## Backend API Contract

Expected endpoints at `NUXT_PUBLIC_API_BASE_URL`:

| Method | Path             | Description                                                 |
| ------ | ---------------- | ----------------------------------------------------------- |
| `POST` | `/auth/login`    | Login — returns `{ user, accessToken, refreshToken }`       |
| `POST` | `/auth/register` | Register — returns `{ user, accessToken, refreshToken }`    |
| `POST` | `/auth/refresh`  | Refresh tokens — body: `{ refreshToken }`                   |
| `POST` | `/auth/logout`   | Logout — no body required                                   |
| `GET`  | `/users/me`      | Get current user — requires `Authorization: Bearer <token>` |

### User Type

```typescript
interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  roles: ('ADMIN' | 'CUSTOMER')[]
  createdAt: string
  updatedAt: string
}
```

---

## Development Conventions

### Imports

- Use `~/` alias to reference files in the `app/` directory (e.g., `~/composables/useAuth`)
- Nuxt auto-imports: `ref`, `computed`, `useFetch`, `useRuntimeConfig`, `navigateTo`, etc.
- Nuxt auto-imports composables, stores, and types from the `app/` directory

### Form Validation

All forms use **Zod** schemas from `~/utils/validation.ts`:

```typescript
import { loginSchema, registerSchema } from '~/utils/validation'
```

### Error Handling

- Toast notifications for user-facing errors
- `~/utils/errorHandler.ts` provides centralized error handling utilities
- API client automatically handles 401 refresh flow

### Testing Practices

- Tests mirror the `app/` directory structure under `tests/`
- Pinia stores tested with `@pinia/testing`
- Utilities (validation, error handling, tokens) have unit tests
- 30 tests passing across 5 test files

### Code Quality

- ESLint 9 with `@nuxt/eslint` preset
- TypeScript strict mode (generated via `.nuxt/tsconfig.*.json`)
- Run linting before committing: no explicit lint script, but ESLint is configured

---

## Environment Variables

| Variable                   | Default                 | Description          |
| -------------------------- | ----------------------- | -------------------- |
| `NUXT_PUBLIC_API_BASE_URL` | `http://localhost:3000` | Backend API base URL |

---

## Known State

- **Migration**: Successfully migrated from root-level structure to Nuxt 4 `app/` directory convention (see `MIGRATION_COMPLETE.md`)
- **All tests passing**: 30 tests across 5 files
- **Current features**: Authentication (admin + user), route protection, form validation, error handling
- **Planned features** (from README): Product listings, shopping cart, order management, user profiles, password reset

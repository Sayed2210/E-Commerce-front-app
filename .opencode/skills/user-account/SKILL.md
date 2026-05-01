---
name: user-account
description: Work on user profile, addresses, wishlist, notifications, points history, and account management pages in this Nuxt e-commerce frontend.
compatibility: opencode
metadata:
  app: ecommerce-front-app
  area: account
---

## When To Use

Use this skill for account page, profile management, address CRUD, wishlist, notifications, points history, and password management flows.

## Account Structure

- Account page: `app/pages/account/index.vue`.
- Account components: `app/components/account/` (AddressesTab, PointsHistoryTab).
- Wishlist page: `app/pages/wishlist/index.vue`.
- Notifications page: `app/pages/notifications.vue`.

## Key Composables and Stores

| Layer      | File                                   | Purpose                                                |
| ---------- | -------------------------------------- | ------------------------------------------------------ |
| Store      | `app/stores/auth.ts`                   | User state, isAuthenticated, isAdmin getter            |
| Composable | `app/composables/useAuth.ts`           | Login, register, logout, fetchUser, resendVerification |
| Composable | `app/composables/useAddresses.ts`      | Address CRUD, set default                              |
| Composable | `app/composables/useWishlist.ts`       | Wishlist CRUD                                          |
| Composable | `app/composables/useNotifications.ts`  | Notifications list, mark read, mark all read, delete   |
| Composable | `app/composables/usePoints.ts`         | Points balance, history, redemption                    |
| Composable | `app/composables/useForgotPassword.ts` | Forgot password form                                   |
| Composable | `app/composables/useResetPassword.ts`  | Reset password form                                    |
| Composable | `app/composables/useVerifyEmail.ts`    | Email verification state machine                       |

## Route Middleware

- `auth.ts` — requires authentication, redirects to `/login`.
- `user.ts` — like auth but redirects admins to `/admin`.
- `guest.ts` — redirects authenticated users away from login/register.

## Implementation Rules

- Use `useAuth()` for user state; do not directly manipulate auth store from pages.
- Use `useAddresses()` for all address operations.
- Use `useWishlist()` for wishlist operations.
- Use `useNotifications()` for notification management.
- Real-time notifications arrive via Socket.io (`app/plugins/socket.client.ts`).
- Notifications store (`app/stores/notifications.ts`) tracks unread count.
- Use `useToasts()` for user-facing success/error messages with i18n.
- Preserve tab-based account page layout pattern.
- Use Zod validation from `app/utils/validation.ts` for form inputs.

## Verification

- Auth changes: run `npx vitest tests/stores/auth.test.ts` and `npx vitest tests/composables/useAuth.test.ts`.
- Wishlist changes: run `npx vitest tests/composables/useWishlist.test.ts`.
- Run `npm run lint` for component or composable changes.

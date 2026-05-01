---
name: real-time-features
description: Work on Socket.io real-time notifications, cart updates, and live event handling in this Nuxt e-commerce frontend.
compatibility: opencode
metadata:
  app: ecommerce-front-app
  area: realtime
---

## When To Use

Use this skill for real-time notification delivery, live cart updates, Socket.io plugin changes, or notification bell behavior.

## Real-Time Structure

- Socket.io plugin: `app/plugins/socket.client.ts` (client-only plugin).
- Notifications store: `app/stores/notifications.ts`.
- Notification bell: `app/components/shared/NotificationBell.vue`.
- Notifications page: `app/pages/notifications.vue`.
- Notifications composable: `app/composables/useNotifications.ts`.

## Socket Events

| Event             | Direction       | Purpose                               |
| ----------------- | --------------- | ------------------------------------- |
| `newNotification` | Server → Client | Push new notification to user         |
| `notification`    | Server → Client | General notification broadcast        |
| `cart_updated`    | Server → Client | Cart state changed (sync across tabs) |

## Implementation Rules

- Socket plugin is client-only (`.client.ts` suffix); never access socket from SSR context.
- Socket connects only when user is authenticated (checks for token).
- Use `useNotifications()` composable for programmatic notification operations.
- Notifications store methods: `setAll`, `prepend`, `markRead`, `markAllRead`, `remove`.
- Notification types: order, promo, system, review.
- Use `formatTimeAgo()` from `useNotifications()` for relative timestamps.
- Preserve existing notification UI patterns (bell badge, dropdown, mark read).
- For cart sync across tabs, rely on `cart_updated` event handler in socket plugin.

## Verification

- Notification changes: run `npx vitest tests/stores/notifications.test.ts`.
- Socket plugin changes: verify client-only behavior with `npm run build`.
- Run `npm run lint` for any composable or component changes.
- Test real-time behavior manually or with Playwright E2E if applicable.

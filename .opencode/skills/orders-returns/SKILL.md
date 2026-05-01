---
name: orders-returns
description: Work on order history, order detail, returns processing, invoice handling, and order analytics in this Nuxt e-commerce frontend.
compatibility: opencode
metadata:
  app: ecommerce-front-app
  area: orders
---

## When To Use

Use this skill for customer order pages, order detail views, returns requests, invoice downloads, and admin order/returns management.

## Order Structure

- Customer orders list: `app/pages/orders/index.vue`.
- Order detail page: `app/pages/orders/[id].vue`.
- Order components: `app/components/orders/` (OrderHeader, OrderLineItems, OrderTotals).
- Order card: `app/components/features/orders/OrderCard.vue`.
- Orders composable: `app/composables/useOrders.ts`.
- Returns composable: `app/composables/useReturns.ts`.
- Invoices composable: `app/composables/useInvoices.ts`.

## Returns Structure

- Admin returns page: `app/pages/admin/returns/index.vue`.
- Admin returns components: `app/components/admin/returns/`.
- Customer returns via `useReturns()` composable.

## API Endpoints

| Composable    | Endpoints                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------- |
| `useOrders`   | `GET /orders`, `GET /orders/:id`, `PATCH /orders/:id/status`, `GET /orders/analytics/summary` |
| `useReturns`  | `GET /returns/my`, `GET /returns/:id`, `POST /returns`, `PATCH /returns/:id/process`          |
| `useInvoices` | `GET /orders/:id/invoice` (PDF download), `POST /admin/orders/:id/resend-invoice`             |

## Implementation Rules

- Use `useOrders()` for order listing, detail fetch, and status updates.
- Use `useReturns()` for customer returns requests and admin return processing.
- Use `useInvoices()` for PDF invoice download and admin invoice resend.
- Preserve existing order card and detail layout patterns.
- Order statuses map to colors via `useStatusColors()` in admin composables.
- Keep order totals calculation consistent with `CartOrderSummary` patterns.
- For admin order status updates, use the same `PATCH /orders/:id/status` endpoint.

## Verification

- Orders changes: run `npx vitest tests/composables/useOrders.test.ts`.
- Returns changes: run `npx vitest tests/composables/useReturns.test.ts`.
- Run `npm run lint` for composable or component changes.
- For E2E: run `npm run test:e2e -- tests/e2e/orders.spec.ts`.

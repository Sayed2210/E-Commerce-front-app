---
name: checkout-payments
description: Work on checkout flow, payment integration (Stripe/PayPal/COD), coupon application, points redemption, and order creation in this Nuxt e-commerce frontend.
compatibility: opencode
metadata:
  app: ecommerce-front-app
  area: checkout
---

## When To Use

Use this skill for checkout page, payment methods, coupon input, points redemption, address selection, order review, and order creation flows.

## Checkout Structure

- Checkout page lives at `app/pages/checkout/index.vue`.
- Checkout components live under `app/components/checkout/`.
- Key components: `CheckoutStepper`, `AddressPicker`, `AddressForm`, `PaymentMethodSelector`, `CouponInput`, `PointsRedemption`, `OrderReviewPanel`, `StripeCardElement`.
- Checkout composable: `app/composables/useCheckout.ts`.
- Cart store: `app/stores/cart.ts`.
- Shipping composable: `app/composables/useShipping.ts`.

## Checkout Flow

1. Address selection (saved addresses or new address via `AddressForm`).
2. Payment method selection (Stripe card, PayPal, Cash on Delivery).
3. Coupon code application via `POST /checkout/apply-coupon`.
4. Points redemption preview and apply via `POST /points/redeem-preview` and `POST /points/redeem`.
5. Order review with totals calculation.
6. Order creation via `POST /checkout/create-order`.

## Implementation Rules

- Use `useCheckout()` composable for coupon apply, checkout validation, and order creation.
- Use `useAddresses()` for address CRUD and default selection.
- Use `usePoints()` for points balance, redemption preview, and redemption.
- Use `useCurrency()` for currency conversion and formatting.
- Stripe integration uses `StripeCardElement` component; load Stripe.js from `NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Preserve the multi-step checkout UI pattern with `CheckoutStepper`.
- Handle loading states and errors consistently with existing toast patterns via `useToasts()`.
- Use Zod validation schemas from `app/utils/validation.ts` for address forms.

## Verification

- Checkout changes: run `npx vitest tests/composables/useCheckout.test.ts`.
- Cart changes: run `npx vitest tests/stores/cart.test.ts`.
- Run `npm run lint` and `npm run build` for page-level changes.
- For payment flow changes, consider `npm run test:e2e` with `tests/e2e/full-journey.spec.ts`.

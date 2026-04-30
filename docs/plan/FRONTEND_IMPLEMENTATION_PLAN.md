# Frontend Implementation Plan

> Plan for the Nuxt 4 frontend to implement Currency CRUD, Point System (Loyalty), Invoice Email, and Shipping Fee Configuration — consuming the backend APIs defined in `docs/plan/IMPLEMENTATION_PLAN.md`.

---

## Priority Order

1. **Currency CRUD** (global switcher + checkout integration)
2. **Point System (Loyalty)** (nested admin section + slider redemption in checkout)
3. **Invoice Email** (download button on order detail)
4. **Shipping Fee Configuration** (replace hardcoded `$9.99`)

---

## Feature 1: Currency CRUD

**Goal:** Admin manages currencies with manual exchange rates. Customers switch currency globally via a header dropdown. Checkout sends `currencyCode` in `CreateOrderDto`. Prices display in selected currency everywhere.

### New Types (`app/types/api.ts`)

```ts
export interface Currency {
  code: string
  name: string
  symbol: string
  exchangeRate: number
  isActive: boolean
  isDefault: boolean
}

export interface CreateCurrencyDto {
  code: string
  name: string
  symbol: string
  exchangeRate: number
  isActive?: boolean
}

export type UpdateCurrencyDto = Partial<CreateCurrencyDto>
```

### New Files

| File                                                 | Purpose                                                                                      |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `app/composables/useCurrencies.ts`                   | Admin CRUD: `list()`, `create(dto)`, `update(code, dto)`, `remove(code)`, `setDefault(code)` |
| `app/composables/useCurrency.ts`                     | Customer: `selectedCurrency` (cookie-backed), `convert(price)`, `format(price)`              |
| `app/components/shared/CurrencySwitcher.vue`         | Global dropdown in default layout header                                                     |
| `app/components/admin/currencies/CurrenciesList.vue` | Admin table: code, name, symbol, rate, active, default, actions                              |
| `app/pages/admin/currencies/index.vue`               | Admin page wrapper (`layout: 'admin'`, `middleware: 'admin'`)                                |

### Modified Files

| File                                                | Change                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `app/layouts/admin.vue`                             | Add nav link: `{ to: '/admin/currencies', icon: 'payments', label: t('admin.currencies') }` |
| `app/layouts/default.vue`                           | Import `<CurrencySwitcher />` in the top nav / header area                                  |
| `app/pages/checkout/index.vue`                      | Pass `currencyCode: selectedCurrency.value` into `CreateOrderDto`                           |
| `app/components/features/cart/CartOrderSummary.vue` | Use `useCurrency().format()` for all price displays                                         |
| `app/components/checkout/OrderReviewPanel.vue`      | Use `useCurrency().format()` for all price displays                                         |
| `app/components/shared/ProductCard.vue`             | Use `useCurrency().format()` for `basePrice` display                                        |
| `app/pages/products/[id].vue`                       | Use `useCurrency().format()` for price display                                              |

### API Endpoints (backend contract)

- `GET /currencies` (public)
- `GET /currencies/:code` (public)
- `POST /currencies` (admin)
- `PATCH /currencies/:code` (admin)
- `DELETE /currencies/:code` (admin)
- `PATCH /currencies/:code/default` (admin)

### Key Decisions

- **State:** `useCurrency()` stores `selectedCurrency` in a cookie (`currency_code`, SSR-safe, 30 days). On init, read cookie → fallback to `isDefault` currency from API → fallback to `USD`.
- **Conversion:** Frontend multiplies base (USD) prices by `exchangeRate`. Backend continues returning base USD prices; frontend converts for display only.
- **Checkout:** `CreateOrderDto` includes `currencyCode`. Backend stores base USD but can return `displayCurrency` / `displayTotal` if needed.
- **Formatting:** `format(price)` returns `${symbol}${convertedPrice.toFixed(2)}`.

---

## Feature 2: Point System (Loyalty)

**Goal:** Users earn points on paid/delivered orders. At checkout, they redeem points via a slider for discounts, free shipping, or free orders. Admin configures rules & redemption options under a single "Loyalty" sidebar section.

### New Types (`app/types/api.ts`)

```ts
export interface PointRule {
  id: string
  pointsPerCurrencySpent: number
  fixedPointsPerOrder: number
  expiryDays: number
  isActive: boolean
  createdAt: string
}

export interface PointTransaction {
  id: string
  userId: string
  orderId?: string
  type: 'earn' | 'redeem'
  amount: number
  balanceAfter: number
  expiresAt?: string
  reason?: string
  createdAt: string
}

export interface PointRedemption {
  id: string
  type: 'discount' | 'free_order' | 'free_shipping'
  pointsRequired: number
  value: number
  isActive: boolean
}

export interface RedeemPointsDto {
  points: number
  redemptionType: 'discount' | 'free_order' | 'free_shipping'
}
```

### New Files

| File                                                   | Purpose                                                                       |
| ------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `app/composables/usePoints.ts`                         | Customer: `getBalance()`, `getHistory()`, `redeemPreview(dto)`, `redeem(dto)` |
| `app/composables/admin/usePointRules.ts`               | Admin CRUD for point rules                                                    |
| `app/composables/admin/usePointRedemptions.ts`         | Admin CRUD for redemption configs                                             |
| `app/components/admin/points/PointRulesList.vue`       | Rules table: pointsPerCurrency, fixedPoints, expiry, active                   |
| `app/components/admin/points/PointRedemptionsList.vue` | Redemptions table: type, pointsRequired, value, active                        |
| `app/pages/admin/loyalty/index.vue`                    | Loyalty hub with tabs: "Earning Rules" / "Redemption Options"                 |
| `app/components/checkout/PointsRedemption.vue`         | Slider + type selector + live preview panel                                   |
| `app/components/account/PointsHistoryTab.vue`          | Points balance + transaction history table                                    |

### Modified Files

| File                                                     | Change                                                                                                           |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `app/layouts/admin.vue`                                  | Add nav link: `{ to: '/admin/loyalty', icon: 'stars', label: t('admin.loyalty') }`                               |
| `app/pages/checkout/index.vue`                           | Add `<PointsRedemption />` before OrderReviewPanel; pass `redeemPoints` + `redemptionType` into `CreateOrderDto` |
| `app/pages/account/index.vue`                            | Add `points` to `activeTab` union; render `<PointsHistoryTab />`                                                 |
| `app/components/shared/NotificationBell.vue` (or header) | Optionally show small points balance badge near user menu                                                        |

### API Endpoints (backend contract)

**Customer:**

- `GET /points/balance` — `{ balance: number }`
- `GET /points/history` — `PaginatedResponse<PointTransaction>`
- `POST /points/redeem-preview` — body: `RedeemPointsDto`, response: `{ discountValue: number, newTotal: number }`

**Admin:**

- `GET /admin/point-rules`
- `POST /admin/point-rules`
- `PATCH /admin/point-rules/:id`
- `DELETE /admin/point-rules/:id`
- `GET /admin/point-redemptions`
- `POST /admin/point-redemptions`
- `PATCH /admin/point-redemptions/:id`
- `DELETE /admin/point-redemptions/:id`

**Checkout:**

- `POST /checkout/create-order` accepts `redeemPoints?: number`, `redemptionType?: 'discount' | 'free_shipping' | 'free_order'`

### Key Decisions

- **Admin nav:** Single "Loyalty" sidebar item. The page has two tabs using `AppTabBar` or similar: "Earning Rules" and "Redemption Options".
- **Checkout slider:** `<input type="range" min="0" :max="userBalance" step="10" />`. On change, debounce-call `POST /points/redeem-preview` to show live discount preview.
- **Redemption flow:**
  1. User selects redemption type from dropdown (filtered to configs where `pointsRequired <= userBalance`).
  2. Slider sets how many points to redeem (usually locked to `pointsRequired` for `free_shipping`/`free_order`, variable for `discount`).
  3. Preview shows `discountValue` and `newTotal`.
  4. On place order, `redeemPoints` + `redemptionType` are sent in `CreateOrderDto`.

---

## Feature 3: Invoice Email (PDF)

**Goal:** Customer can download the invoice PDF for any paid/delivered order. Admin can resend invoice email.

### New Types (`app/types/api.ts`)

```ts
export interface Invoice {
  id: string
  orderId: string
  invoiceNumber: string
  pdfUrl: string
  createdAt: string
}
```

### New Files

| File                             | Purpose                                                              |
| -------------------------------- | -------------------------------------------------------------------- |
| `app/composables/useInvoices.ts` | `downloadInvoice(orderId)` — fetches blob, triggers browser download |

### Modified Files

| File                                             | Change                                                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `app/pages/orders/[id].vue`                      | Add "Download Invoice" button (only if `order.status === 'paid' \|\| order.status === 'delivered'`) |
| `app/components/admin/orders/OrdersTableRow.vue` | Add "Resend Invoice" action in row dropdown menu                                                    |

### API Endpoints (backend contract)

- `GET /orders/:id/invoice` (customer) — returns PDF blob (`Content-Type: application/pdf`)
- `POST /admin/orders/:id/resend-invoice` (admin) — returns `{ success: boolean }`

### Key Decisions

- **Download:** `$fetch` with `responseType: 'blob'`, then `URL.createObjectURL(blob)` + create `<a download="invoice-{orderNumber}.pdf">` and click.
- **Visibility:** Download button only appears for orders with `paymentStatus === 'paid' || status === 'delivered'`.
- **Admin resend:** Simple POST call with toast success/error feedback.

---

## Feature 4: Shipping Fee Configuration

**Goal:** Admin configures shipping zones and weight-based rates. Checkout calculates shipping dynamically instead of using the hardcoded `$9.99`.

### New Types (`app/types/api.ts`)

```ts
export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  isActive: boolean
}

export interface ShippingRate {
  id: string
  shippingZoneId: string
  minWeight: number
  maxWeight: number
  baseCost: number
  perKgCost: number
  freeShippingThreshold: number
}

export interface CreateShippingZoneDto {
  name: string
  countries: string[]
  isActive?: boolean
}

export interface CreateShippingRateDto {
  shippingZoneId: string
  minWeight: number
  maxWeight: number
  baseCost: number
  perKgCost: number
  freeShippingThreshold?: number
}
```

### New Files

| File                                                  | Purpose                                                               |
| ----------------------------------------------------- | --------------------------------------------------------------------- |
| `app/composables/admin/useShippingZones.ts`           | Admin CRUD for zones                                                  |
| `app/composables/admin/useShippingRates.ts`           | Admin CRUD for rates                                                  |
| `app/components/admin/shipping/ShippingZonesList.vue` | Zones table: name, countries count, active, actions                   |
| `app/components/admin/shipping/ShippingRatesList.vue` | Rates table per zone: weight range, base cost, per-kg, free threshold |
| `app/pages/admin/shipping/index.vue`                  | Admin page with tabs: Zones / Rates                                   |
| `app/composables/useShipping.ts`                      | Customer: `calculateShipping(addressId, weight, orderValue)`          |

### Modified Files

| File                                                | Change                                                                                               |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `app/layouts/admin.vue`                             | Add nav link: `{ to: '/admin/shipping', icon: 'local_shipping', label: t('admin.shipping') }`        |
| `app/pages/checkout/index.vue`                      | After address selection, call `calculateShipping()` and replace hardcoded `$9.99` with dynamic value |
| `app/pages/cart/index.vue`                          | Remove hardcoded shipping display; show "Shipping calculated at checkout"                            |
| `app/components/features/cart/CartOrderSummary.vue` | Remove or make conditional the shipping line item                                                    |

### API Endpoints (backend contract)

**Admin:**

- `GET /shipping/zones`
- `POST /shipping/zones`
- `PATCH /shipping/zones/:id`
- `DELETE /shipping/zones/:id`
- `GET /shipping/rates`
- `POST /shipping/rates`
- `PATCH /shipping/rates/:id`
- `DELETE /shipping/rates/:id`

**Customer:**

- `GET /shipping/calculate?addressId=&weight=&orderValue=` — returns `{ cost: number, freeShipping: boolean }`

### Key Decisions

- **Cart page:** Do not show a shipping amount. Show "Shipping & taxes calculated at checkout" text.
- **Checkout:** After `AddressPicker` emits a selected address, trigger `calculateShipping()`. If `freeShipping: true`, show "Free Shipping" badge and set `shippingAmount = 0`.
- **Hardcoded cleanup:** Remove the `$9.99` fee and `$99` free-shipping threshold from `app/pages/checkout/index.vue` and `app/pages/cart/index.vue`.
- **Weight:** Cart total weight can be computed as `sum(item.product.weight * item.quantity)` if `weight` exists on Product; otherwise backend computes it.

---

## Execution Order

```
Phase 1 — Currency (3–4 days)
  ├── Types + composables + admin page + nav
  ├── CurrencySwitcher component (global header)
  ├── Price conversion in cart/checkout/product/order summaries
  └── Tests + lint + build

Phase 2 — Points System (3–4 days)
  ├── Types + admin composables + Loyalty admin page + nav
  ├── Points balance display (header/account)
  ├── Points redemption slider in checkout
  ├── Points history tab in account
  └── Tests + lint + build

Phase 3 — Invoice (0.5–1 day)
  ├── Types + composable
  ├── Download button on order detail
  ├── Resend action in admin orders
  └── Tests + lint + build

Phase 4 — Shipping Config (2–3 days)
  ├── Types + admin composables + admin page + nav
  ├── Replace hardcoded shipping with API call
  ├── Cart page shipping text update
  └── Tests + lint + build
```

**Total estimated effort: ~9–12 developer-days.**

---

## Complete File Map

### New Files

| File                                                   | Feature  |
| ------------------------------------------------------ | -------- |
| `app/composables/useCurrencies.ts`                     | Currency |
| `app/composables/useCurrency.ts`                       | Currency |
| `app/components/shared/CurrencySwitcher.vue`           | Currency |
| `app/components/admin/currencies/CurrenciesList.vue`   | Currency |
| `app/pages/admin/currencies/index.vue`                 | Currency |
| `app/composables/usePoints.ts`                         | Points   |
| `app/composables/admin/usePointRules.ts`               | Points   |
| `app/composables/admin/usePointRedemptions.ts`         | Points   |
| `app/components/admin/points/PointRulesList.vue`       | Points   |
| `app/components/admin/points/PointRedemptionsList.vue` | Points   |
| `app/pages/admin/loyalty/index.vue`                    | Points   |
| `app/components/checkout/PointsRedemption.vue`         | Points   |
| `app/components/account/PointsHistoryTab.vue`          | Points   |
| `app/composables/useInvoices.ts`                       | Invoice  |
| `app/composables/admin/useShippingZones.ts`            | Shipping |
| `app/composables/admin/useShippingRates.ts`            | Shipping |
| `app/composables/useShipping.ts`                       | Shipping |
| `app/components/admin/shipping/ShippingZonesList.vue`  | Shipping |
| `app/components/admin/shipping/ShippingRatesList.vue`  | Shipping |
| `app/pages/admin/shipping/index.vue`                   | Shipping |

### Modified Files

| File                                                | Feature                    |
| --------------------------------------------------- | -------------------------- |
| `app/types/api.ts`                                  | All 4                      |
| `app/layouts/admin.vue`                             | Currency, Points, Shipping |
| `app/layouts/default.vue`                           | Currency                   |
| `app/pages/checkout/index.vue`                      | Currency, Points, Shipping |
| `app/pages/cart/index.vue`                          | Currency, Shipping         |
| `app/pages/account/index.vue`                       | Points                     |
| `app/pages/orders/[id].vue`                         | Invoice                    |
| `app/components/features/cart/CartOrderSummary.vue` | Currency, Shipping         |
| `app/components/checkout/OrderReviewPanel.vue`      | Currency, Points           |
| `app/components/shared/ProductCard.vue`             | Currency                   |
| `app/pages/products/[id].vue`                       | Currency                   |
| `app/components/admin/orders/OrdersTableRow.vue`    | Invoice                    |

---

## Definition of Done

- [ ] Currency switcher visible in default layout header; prices convert correctly across all pages
- [ ] Admin can CRUD currencies; default currency is enforced
- [ ] Checkout sends `currencyCode` in `CreateOrderDto`
- [ ] Points balance visible in account page; history tab lists transactions
- [ ] Checkout shows points slider with live preview; redemption applies on order creation
- [ ] Admin "Loyalty" page has tabs for Rules and Redemptions with full CRUD
- [ ] Order detail page shows "Download Invoice" button for paid/delivered orders
- [ ] Admin orders table has "Resend Invoice" action
- [ ] Checkout calculates shipping dynamically after address selection
- [ ] Cart page no longer shows hardcoded shipping amount
- [ ] Admin "Shipping" page has tabs for Zones and Rates with full CRUD
- [ ] All new composables use `useApiClient()` for authenticated requests
- [ ] `npm run lint` passes with zero errors
- [ ] `npm test` passes (add unit tests for new composables)
- [ ] `npm run build` succeeds

---

## Dependencies Checklist

| Package           | Purpose                                                          | Install Command |
| ----------------- | ---------------------------------------------------------------- | --------------- |
| None new required | All features use existing `$fetch`, `useApiClient()`, `@nuxt/ui` | —               |

> If the backend returns PDF URLs instead of blobs, no additional frontend package is needed. If blob handling is required, native browser APIs (`URL.createObjectURL`) suffice.

---

## Verification Steps (Manual QA)

1. **Currency**
   - Admin creates `EGP` with rate `30.9`.
   - Customer switches to EGP in header; product prices multiply by 30.9.
   - Checkout places order with `currencyCode: 'EGP'`; backend stores USD, frontend displays EGP.

2. **Points**
   - Admin sets rule: 1 point per 1 USD.
   - Customer places order for $100; balance shows 100 points.
   - Admin creates redemption: 100 points = $5 discount.
   - Customer at checkout slides to 100 points; preview shows $5 off.
   - Order total reflects discount.

3. **Invoice**
   - Place order; go to order detail.
   - Click "Download Invoice"; PDF downloads with correct order data.
   - Admin clicks "Resend Invoice"; email is queued.

4. **Shipping**
   - Admin creates zone "Egypt" with country `EG`.
   - Admin creates rate: 0–5kg = $5 base + $1/kg, free over $100.
   - Customer with Egypt address and 3kg cart sees $8 shipping (or free if over $100).

---

## Notes

- **Follow existing patterns:** Use the same structure as `useCoupons.ts` + `CouponsList.vue` + `app/pages/admin/coupons/index.vue` for all new admin features.
- **Global component uniqueness:** Remember `pathPrefix: false` in `nuxt.config.ts`. Every new `.vue` file under `app/components/` must have a globally unique filename.
- **i18n:** Add new translation keys to `i18n/locales/en.json` and `ar.json` for all UI labels.
- **Auth headers:** Prefer `useApiClient()` over manual `authH()` in new composables. Refactor existing ones only if touching them already.

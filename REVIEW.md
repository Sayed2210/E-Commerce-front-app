# Project Review — Findings & Task List

> Generated: 2026-04-21 | Branch: `dev`

---

## Batch 1 — Blockers

### TASK-01 · Fix Playwright baseURL port mismatch

- **File**: `playwright.config.ts:12`
- **Issue**: `baseURL` is `http://localhost:9001` but `webServer.url` is `http://localhost:3001`. Playwright never connects to the running dev server.
- **Fix**: Change `baseURL` to `http://localhost:3001` (or use an env variable).
- **Status**: [x] Done

---

### TASK-02 · Disable "Place Order" when email is unverified

- **File**: `app/components/checkout/OrderReviewPanel.vue:71`
- **Issue**: `emailNotVerified` prop shows a warning banner but the button is only gated on `loading`. The user can keep retrying, spamming the backend with 403s.
- **Fix**: Add `:disabled="loading || emailNotVerified"` to the Place Order button.
- **Status**: [x] Done

---

## Batch 2 — Code Correctness

### TASK-03 · Remove duplicate token refresh logic in api.ts

- **File**: `app/utils/api.ts:24-45` and `app/utils/api.ts:74-97`
- **Issue**: Two independent refresh paths exist — one inside the `$fetch.create` interceptor and another inline inside `apiCall()`. Concurrent 401 responses can trigger both simultaneously, creating a race condition.
- **Fix**: Remove the inline refresh block from `apiCall()` and rely solely on the interceptor; or collapse both into one path with a shared refresh promise.
- **Note**: Also fixed a stale-token bug in the interceptor retry — `onRequest` had already set the expired token in `options.headers`, so the fresh token must be explicitly written before the retry `$fetch` call.
- **Status**: [x] Done

---

### TASK-04 · Fix `pathPrefix: false` component naming collision risk

- **File**: `nuxt.config.ts:52-58`
- **Issue**: `pathPrefix: false` means Nuxt auto-imports components by filename only, ignoring folder structure. Any two components sharing a filename silently shadow each other (the `List.vue` collision that broke Playwright is a direct result of this).
- **Fix**: Remove `pathPrefix: false` so components are named by full path (e.g. `AdminProductsList`, `AdminOrdersList`), OR keep it and audit for any remaining filename duplicates across `app/components/`.
- **Resolution**: Audited all 54 component filenames — no duplicates found. Kept `pathPrefix: false` and strengthened the comment to make the uniqueness invariant explicit.
- **Status**: [x] Done

---

## Batch 3 — Security

### TASK-05 · Document client-side cookie limitation (HttpOnly not possible)

- **File**: `app/utils/token.ts:7-11`
- **Issue**: Tokens are written via `document.cookie` (client-only). `HttpOnly` can only be set by a server `Set-Cookie` header — not from JavaScript. Any XSS can steal both the access and refresh tokens.
- **Fix (short-term)**: Add a comment marking this as a known limitation pending backend support.
- **Fix (long-term)**: Move token issuance to a server-side endpoint that responds with `Set-Cookie: ...; HttpOnly; Secure; SameSite=Strict`.
- **Status**: [x] Done

---

### TASK-06 · Always apply `Secure` flag or document why it is skipped in dev

- **File**: `app/utils/token.ts:9`
- **Issue**: `Secure` is only appended in `production`. Tokens are transmitted over plain HTTP in development and staging environments.
- **Fix**: Either apply `Secure` unconditionally, or add a comment explaining the intentional dev-only exemption.
- **Status**: [x] Done

---

## Batch 4 — Cleanup

### TASK-07 · Rename `tokens.ts` → `designTokens.ts`

- **File**: `app/utils/tokens.ts`
- **Issue**: `tokens.ts` (auto-generated design tokens — colors, fonts) sits alongside `token.ts` (auth token management). One wrong import is a silent no-op or a confusing build error.
- **Fix**: Rename `app/utils/tokens.ts` to `app/utils/designTokens.ts` and update all imports.
- **Status**: [x] Done

---

### TASK-08 · Add Socket.IO error and connect_error handlers

- **File**: `app/plugins/socket.client.ts:22-25`
- **Issue**: Only `notification` events are handled. `connect_error` and `error` events are ignored, so connection failures are completely silent to the user.
- **Fix**: Add `socket.on('connect_error', handler)` and `socket.on('error', handler)` that emit an app-level notification or log a warning.
- **Status**: [x] Done

---

### TASK-09 · Extract shipping constants to a shared location

- **Files**: `app/pages/checkout/index.vue:38`, `app/pages/cart/index.vue`
- **Issue**: The `$9.99` fee and `$99` free-shipping threshold are duplicated in two files. Updating one without the other causes a user-visible inconsistency.
- **Fix**: Move both values to `app/utils/constants.ts` (or equivalent) and import from there.
- **Status**: [x] Done

---

## Summary

| Task                                             | Batch           | Severity | Status   |
| ------------------------------------------------ | --------------- | -------- | -------- |
| TASK-01 Playwright port mismatch                 | 1 — Blockers    | High     | [x] Done |
| TASK-02 Place Order disabled on unverified email | 1 — Blockers    | Medium   | [x] Done |
| TASK-03 Duplicate token refresh race condition   | 2 — Correctness | Medium   | [x] Done |
| TASK-04 pathPrefix: false collision risk         | 2 — Correctness | Medium   | [x] Done |
| TASK-05 HttpOnly cookie limitation               | 3 — Security    | High     | [x] Done |
| TASK-06 Secure flag missing in dev               | 3 — Security    | Low      | [x] Done |
| TASK-07 Rename tokens.ts → designTokens.ts       | 4 — Cleanup     | Low      | [x] Done |
| TASK-08 Socket.IO error handlers                 | 4 — Cleanup     | Low      | [x] Done |
| TASK-09 Shipping constants duplication           | 4 — Cleanup     | Low      | [x] Done |

---
name: ecommerce-testing
description: Add, update, or debug Vitest and Playwright coverage for this Nuxt e-commerce frontend.
compatibility: opencode
metadata:
  app: ecommerce-front-app
  area: testing
---

## When To Use

Use this skill when writing tests, fixing failing tests, reproducing bug reports, or verifying user flows in this app.

## Test Layout

- Unit and composable tests live under `tests/` and run with Vitest.
- E2E tests live under `tests/e2e/` and run with Playwright.
- Page objects live in `tests/e2e/pages/`.
- API mocks live in `tests/mocks/api.ts`.
- Shared test helpers live in `tests/utils/testUtils.ts`.

## Testing Approach

- Prefer the narrowest test that proves the changed behavior.
- Update existing tests before adding new files when coverage already exists nearby.
- Match the current mock style instead of inventing a second mocking pattern.
- For composables, test loading, success, error, and important state transitions when applicable.
- For stores, test state updates and persisted/token side effects explicitly.
- For E2E, use existing page objects and selectors before adding new direct locator code.

## Commands

- Single Vitest file: `npx vitest tests/path/to/file.test.ts`.
- All unit tests: `npm test`.
- Watch mode: `npm run test:watch`.
- Coverage: `npm run test:coverage`.
- E2E tests: `npm run test:e2e`.
- CI sequence: `npm run tokens:check`, `npm run lint`, `npm test`, `npm run build`.

## Debugging

- If a test fails after a code change, identify whether the assertion or implementation is stale before changing either.
- Do not weaken assertions just to pass; keep tests tied to visible behavior or domain state.
- Prefer deterministic mocks over real network calls.

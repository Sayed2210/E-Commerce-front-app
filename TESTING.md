# E-Commerce Frontend - Testing Guide

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with UI

```bash
npm run test:ui
```

### Generate coverage report

```bash
npm run test:coverage
```

## Test Structure

- `tests/utils/` - Utility function tests
- `tests/stores/` - Pinia store tests
- `tests/composables/` - Composable tests (requires Nuxt environment)
- `tests/middleware/` - Middleware tests (requires Nuxt environment)
- `tests/components/` - Component tests (requires full setup)

## Note on Nuxt-Specific Tests

Some tests (composables, middleware, components) require the full Nuxt test environment to be properly configured. These have placeholder tests and should be expanded once the application is running.

## Current Test Coverage

- ✅ Validation schemas (Zod)
- ✅ Error handler utility
- ✅ Token utility (basic)
- ✅ Auth store (Pinia)
- ⏳ Composables (placeholder)
- ⏳ Middleware (placeholder)
- ⏳ Components (placeholder)

The basic utility and store tests are ready to run. Integration tests would require the backend API to be running.

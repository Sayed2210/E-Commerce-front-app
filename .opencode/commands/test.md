---
description: Run tests and fix failures
agent: build
---

Run the full test suite and address any failures.

Current test results:
!`npm test -- --run 2>&1 || true`

Analyze any failing tests and fix the underlying issues. Do not weaken assertions — fix the implementation or update stale tests to match current behavior.

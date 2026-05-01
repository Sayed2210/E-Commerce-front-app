---
description: Run full CI pipeline
agent: build
---

Run the complete CI pipeline in order and report results.

CI pipeline order: tokens:check -> lint -> test -> build

Step 1 - Tokens:
!`npm run tokens:check 2>&1 || true`

Step 2 - Lint:
!`npm run lint 2>&1 || true`

Step 3 - Test:
!`npm test -- --run 2>&1 || true`

Step 4 - Build:
!`npm run build 2>&1 || true`

Report which steps passed or failed. Fix any failures starting from the first failing step.

---
description: Run lint and auto-fix issues
agent: build
---

Run ESLint and Stylelint with auto-fix, then resolve any remaining issues.

Current lint status:
!`npm run lint 2>&1 || true`

!`npm run lint:styles 2>&1 || true`

Fix all reported issues. Run `npm run lint:fix` and `npm run lint:styles:fix` first, then manually address anything that remains.

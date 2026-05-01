---
description: Review recent changes
agent: plan
---

Review recent changes in the codebase and provide feedback.

Recent commits:
!`git log --oneline -10 2>&1 || echo "No git history"`

Current working tree status:
!`git status --short 2>&1 || echo "Not a git repo"`

Staged and unstaged changes:
!`git diff --stat 2>&1 || true`
!`git diff --cached --stat 2>&1 || true`

Review the changes for:

- Code quality and consistency with project conventions
- Potential bugs or edge cases
- Performance implications
- Security considerations
- Missing tests for new behavior
- i18n coverage (both en.json and ar.json translations)
- Component naming uniqueness (pathPrefix: false)

Provide constructive feedback without making direct changes.

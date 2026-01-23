---
description: Build and update the Next.js consumer web app.
---

# Web App (Next.js)

## When to Apply

- Creating or updating pages, routes, or server components
- Implementing client/server data fetching
- Improving performance, bundle size, or UX
- Updating i18n strings or currency formatting

## How It Works

1. Read relevant context (AGENTS.md, PLAN.md, CONTRIBUTING.md).
2. Locate the target route or component under `apps/web`.
3. Prefer shared types/utils from `packages/shared`.
4. Apply App Router patterns and performance best practices.
5. Verify i18n usage and VND formatting.

## Key Paths

- `apps/web/app/`
- `apps/web/components/`
- `apps/web/lib/`
- `packages/shared/`

## Output Expectations

- Use App Router conventions (server components where appropriate)
- Avoid hardcoded strings; use i18n keys
- Use shared currency formatter (VND, no decimals)

## Testing

- Playwright for E2E (web)
- Vitest for unit/integration (when applicable)

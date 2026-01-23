---
description: Build and update the vendor dashboard (Next.js).
---

# Vendor Dashboard

## When to Apply

- Adding vendor workflows (orders, catalog, pricing)
- Updating vendor UI and dashboards
- Improving clarity and low-tech usability

## How It Works

1. Read relevant context (AGENTS.md, PLAN.md, CONTRIBUTING.md).
2. Locate the target route/component under `apps/vendor`.
3. Reuse shared UI and types.
4. Keep flows minimal and status-driven.

## Key Paths

- `apps/vendor/app/`
- `apps/vendor/components/`
- `packages/ui/`
- `packages/shared/`

## Output Expectations

- Clear status indicators and minimal steps
- Use shared UI/types where possible

## Testing

- Playwright for E2E (web)
- Vitest for unit/integration

---
description: Build and update the Expo React Native consumer app.
---

# Mobile App (Expo)

## When to Apply

- Adding screens, navigation, or UI components
- Integrating Convex queries/mutations
- Improving offline-tolerant UX

## How It Works

1. Read relevant context (AGENTS.md, PLAN.md, CONTRIBUTING.md).
2. Locate the screen or component under `apps/mobile`.
3. Use Expo Router patterns and shared utilities.
4. Prefer optimistic updates with Convex.
5. Ensure UX works under intermittent connectivity.

## Key Paths

- `apps/mobile/app/`
- `apps/mobile/components/`
- `apps/mobile/convex/`
- `packages/shared/`

## Output Expectations

- Expo Router (`app/` routes)
- Shared types/utils over local copies
- Optimistic updates for mutations

## Testing

- Mobile E2E tooling TBD (Detox/Maestro)
- Vitest for unit tests when applicable

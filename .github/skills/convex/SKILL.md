---
description: Implement Convex schema, functions, and Effect.js services.
---

# Convex Backend + Effect.js

## When to Apply

- Creating or updating Convex schema, queries, mutations, actions
- Adding business logic with Effect.js services
- Working on payment, orders, catalog, vendors

## How It Works

1. Read relevant context (AGENTS.md, PLAN.md, CONTRIBUTING.md).
2. Keep Convex functions thin; move logic into services.
3. Use `Effect.gen`, typed errors, and `Layer` DI.
4. Validate inputs with `v.*` and keep pricing in VND.

## Key Paths

- `convex/schema.ts`
- `convex/*.ts`
- `convex/services/`
- `convex/actions/`

## Output Expectations

- Typed errors via `Data.TaggedError`
- DI via `Layer` and explicit services
- Mutations/queries as thin wrappers

## Testing

- `convex-test` for integration
- Vitest for service unit tests

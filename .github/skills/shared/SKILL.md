---
description: Maintain shared types and utilities used across apps.
---

# Shared Package

## When to Apply

- Adding or updating shared types/constants/utils
- Refactoring duplicated logic into shared helpers

## How It Works

1. Read relevant context (AGENTS.md, PLAN.md, CONTRIBUTING.md).
2. Keep shared code framework-agnostic (no React).
3. Prefer explicit types and small pure utilities.

## Key Paths

- `packages/shared/types/`
- `packages/shared/utils/`
- `packages/shared/constants/`

## Output Expectations

- No React dependencies
- Pure functions with explicit types

## Testing

- Vitest for utilities

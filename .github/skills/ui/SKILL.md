---
description: Build shared UI components used across web and vendor apps.
---

# UI Package

## When to Apply

- Creating or updating shared UI components
- Normalizing UI patterns between apps

## How It Works

1. Read relevant context (AGENTS.md, PLAN.md, CONTRIBUTING.md).
2. Keep components composable and accessible.
3. Avoid app-specific business logic.
4. Prefer Tailwind-compatible styling.

## Key Paths

- `packages/ui/components/`

## Output Expectations

- Accessible, composable components
- No app-specific logic

## Testing

- Vitest + React Testing Library (when set up)

# AGENTS

Comoi is a consumer grocery marketplace app for Southeast Asia, starting in Vietnam.

## Essentials
- Package manager: Bun (use `bun` instead of `npm`).
- Non-standard commands:
  - `bun run typecheck`
  - `bun run check`
- Do not start the dev server; the user runs it separately.
- After implementation: run `bun lint`, `bun typecheck`, and the appropriate tests (Playwright, Detox, or Vitest).

## More guidance
- [AI workflow and references](docs/agents/workflow.md)
- [Testing and snapshots](docs/agents/testing.md)
- [Effect.js patterns](docs/agents/effect.md)
- [Convex patterns](docs/agents/convex.md)
- [Graphite workflow](docs/agents/graphite.md)
- [Tech stack decisions](docs/agents/stack.md)

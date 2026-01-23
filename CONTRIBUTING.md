# Contributing to Comoi

This document outlines the development workflow for Comoi, optimized for **AI-assisted development** using GitHub Copilot, Git stacked diffs with Graphite, and Linear for project management.

---

## Table of Contents

- [Development Philosophy](#development-philosophy)
- [Required Tools](#required-tools)
- [AI-Assisted Development Workflow](#ai-assisted-development-workflow)
- [Git Workflow with Graphite](#git-workflow-with-graphite)
- [Linear Project Management](#linear-project-management)
- [Code Review Process](#code-review-process)
- [Best Practices](#best-practices)

---

## Development Philosophy

### AI-First Development

We embrace AI as a **pair programming partner**, not just an autocomplete tool. The workflow is designed to:

1. **Maximize context** — Give the AI enough information to make good decisions
2. **Work in small chunks** — Break work into focused, reviewable units
3. **Verify continuously** — Run tests and type-checks after each change
4. **Document intent** — Clear commit messages and PR descriptions help future AI sessions

### Core Principles

- **Small, stacked PRs** over large monolithic changes
- **Type safety first** — TypeScript strict mode, Effect.js for errors
- **Test as you go** — Write tests alongside implementation
- **Iterate quickly** — Ship small improvements frequently

---

## Required Tools

### Essential

| Tool | Purpose | Installation |
|------|---------|--------------|
| **VS Code** | Primary IDE | [Download](https://code.visualstudio.com/) |
| **GitHub Copilot** | AI pair programming | VS Code Extension |
| **Graphite CLI** | Stacked diffs | `npm i -g @withgraphite/graphite-cli` |
| **Linear** | Project management | [linear.app/comoi](https://linear.app/comoi) |
| **Node.js 20+** | Runtime | `brew install node` or [nvm](https://github.com/nvm-sh/nvm) |
| **pnpm** | Package manager | `npm i -g pnpm` |

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "github.copilot",
    "github.copilot-chat",
    "withgraphite.graphite-vscode",
    "linear.linear",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Initial Setup

```bash
# Clone repository
git clone https://github.com/sebkasanzew/comoi.git
cd comoi

# Install dependencies
pnpm install

# Set up Graphite
gt auth --token <your-graphite-token>
gt init

# Verify setup
gt log
```

---

## AI-Assisted Development Workflow

### Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI-ASSISTED DEVELOPMENT CYCLE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. PLAN          2. IMPLEMENT        3. VERIFY         4. SHIP             │
│  ┌─────────┐      ┌─────────────┐     ┌──────────┐     ┌─────────┐         │
│  │ Linear  │ ──▶  │ Copilot +   │ ──▶ │ Tests +  │ ──▶ │Graphite │         │
│  │ Issue   │      │ Subagents   │     │ Types    │     │ Stack   │         │
│  └─────────┘      └─────────────┘     └──────────┘     └─────────┘         │
│       │                 │                  │                │               │
│       ▼                 ▼                  ▼                ▼               │
│  Break down        Code with AI      Run `pnpm check`   `gt create`        │
│  into tasks        assistance        Fix issues         `gt submit`        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Agent Context & Skills

VS Code automatically loads **AGENTS.md** files as chat context (v1.104+). Use them to keep high-level project context and conventions.

We also use **Agent Skills** (v1.108+) to provide task-specific guidance. Skills live in:

- `.github/skills/web/` — Next.js web app
- `.github/skills/mobile/` — Expo mobile app
- `.github/skills/vendor/` — Vendor dashboard
- `.github/skills/convex/` — Convex backend and Effect.js services
- `.github/skills/shared/` — Shared types/utils
- `.github/skills/ui/` — Shared UI components

When starting an AI session, reference the relevant skill folder for the area you’re working on.

### Step 1: Plan with Linear

Before coding, create or pick up a Linear issue:

1. **Create an issue** in [Linear](https://linear.app/comoi) with:
   - Clear title describing the feature/fix
   - Acceptance criteria
   - Technical notes (optional)

2. **Break down large issues** into sub-issues:
   - Each sub-issue = 1 PR
   - Target 100-300 lines changed per PR

3. **Move issue to "In Progress"** when starting

**Example Issue:**
```
Title: Implement product search with Effect.js
Description: 
- Create CatalogService with searchProducts method
- Add Convex query for full-text search
- Handle errors with Effect.js typed errors
- Write unit tests

Acceptance Criteria:
- [ ] Search returns products matching query
- [ ] Empty query returns featured products
- [ ] Errors are typed and handled
- [ ] Tests pass with >80% coverage
```

### Step 2: Implement with Copilot

#### Starting a Session

1. **Open relevant files** for context:
   - The file you're editing
   - Related types/interfaces
   - Existing similar implementations
   - Test files

2. **Use Copilot Chat** (Cmd+Shift+I) to discuss approach:
   ```
   I need to implement a product search service using Effect.js.
   The service should:
   - Search products in Convex database
   - Return typed errors for edge cases
   - Be testable with dependency injection
   
   Here's the existing pattern from @catalog.ts...
   ```

3. **Reference files with @** mentions:
   - `@workspace` — Search entire workspace
   - `@file.ts` — Reference specific file
   - `#selection` — Reference selected code

#### Copilot Agent Mode

For complex, multi-file changes, use **Agent Mode**:

1. Press `Cmd+Shift+I` to open Copilot Chat
2. Click the **Agent** icon or type `/agent`
3. Describe the full task:

```
Create the PaymentService using Effect.js following the pattern in 
@convex/services/catalog.ts. Include:
1. MoMo payment initiation
2. Webhook verification
3. Typed errors (PaymentError)
4. Unit tests

Use the existing ConfigService for API keys.
```

Agent mode will:
- Create multiple files
- Run terminal commands
- Install dependencies
- Execute tests

#### Subagent Patterns

Use subagents for **research and exploration**:

```
# Good subagent prompts:

"Search the codebase for all usages of Effect.gen and summarize 
the patterns used. Don't make any changes."

"Find all Convex mutations that handle payments and list their 
error handling approaches."

"Research how other files in convex/services/ structure their 
Layer implementations."
```

#### Copilot Edits (Multi-File)

For coordinated changes across files:

1. Select files in **Copilot Edits** panel
2. Describe the change:
   ```
   Add a new 'LOW_STOCK' status to stock_status in:
   - schema.ts (add to union)
   - catalog.ts (handle in service)
   - StockBadge.tsx (add UI variant)
   ```
3. Review each file's diff before accepting

### Step 3: Verify Changes

**Always run before committing:**

```bash
# Type check
pnpm typecheck

# Lint
pnpm lint

# Test
pnpm test

# All checks (recommended)
pnpm check
```

**Quick verification loop:**
```bash
# Watch mode for rapid iteration
pnpm test:watch
pnpm dev  # In another terminal
```

### Step 4: Ship with Graphite

See [Git Workflow with Graphite](#git-workflow-with-graphite) below.

---

## Git Workflow with Graphite

### Why Stacked Diffs?

Stacked diffs enable:
- **Smaller PRs** — Easier to review
- **Faster iteration** — Don't wait for review to continue
- **Better history** — Each commit is a logical unit
- **Parallel work** — Stack multiple features

### Basic Commands

```bash
# Create a new branch in your stack
gt create -m "feat: add product search service"

# See your current stack
gt log

# Submit all PRs in stack
gt submit

# Sync with main and restack
gt sync

# Move to different branch in stack
gt checkout <branch-name>
gt up    # Move up the stack
gt down  # Move down the stack
```

### Workflow Example

```bash
# 1. Start from main
gt sync

# 2. Create first PR (foundation)
# ... make changes ...
gt create -m "feat(catalog): add CatalogService skeleton"

# 3. Create second PR (builds on first)
# ... make more changes ...
gt create -m "feat(catalog): implement searchProducts"

# 4. Create third PR (builds on second)
# ... make more changes ...
gt create -m "test(catalog): add CatalogService tests"

# 5. View your stack
gt log
# Output:
#   feat(catalog): add CatalogService tests
#   feat(catalog): implement searchProducts
#   feat(catalog): add CatalogService skeleton
#   main

# 6. Submit all PRs
gt submit

# 7. After review, if you need to update PR #2:
gt checkout feat-catalog-implement-searchProducts
# ... make changes ...
gt modify
gt submit  # Re-submits and restacks dependent PRs
```

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer: Linear issue]
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code change that neither fixes nor adds
- `test` — Adding or updating tests
- `docs` — Documentation only
- `chore` — Maintenance tasks
- `perf` — Performance improvement

**Examples:**
```bash
gt create -m "feat(orders): add order creation mutation"
gt create -m "fix(payments): handle MoMo timeout correctly"
gt create -m "refactor(catalog): use Effect.gen instead of pipe"
gt create -m "test(vendors): add vendor registration tests"
```

### Linking to Linear

Include Linear issue ID in commit footer:

```bash
gt create -m "feat(catalog): implement product search

Implements full-text search using Convex search indexes.

Linear: COM-123"
```

Or use the Linear VS Code extension for auto-linking.

### Handling Conflicts

```bash
# When main has moved ahead
gt sync

# If there are conflicts
# 1. Resolve conflicts in VS Code
# 2. Stage resolved files
git add .
# 3. Continue sync
gt continue

# Restack all dependent branches
gt restack
```

---

## Linear Project Management

### Project Structure

```
Comoi (Team)
├── 🎯 MVP Launch (Project)
│   ├── Phase 1: Foundation
│   ├── Phase 2: Consumer Web
│   ├── Phase 3: Payments
│   └── ...
├── 🐛 Bugs (Project)
└── 💡 Ideas (Project)
```

### Issue Workflow

```
Backlog → Todo → In Progress → In Review → Done
```

1. **Backlog** — Ideas and future work
2. **Todo** — Prioritized for current sprint
3. **In Progress** — Actively being worked on (max 2 per person)
4. **In Review** — PR submitted, awaiting review
5. **Done** — Merged to main

### Issue Labels

| Label | Description |
|-------|-------------|
| `feature` | New functionality |
| `bug` | Something broken |
| `tech-debt` | Refactoring, cleanup |
| `ai-assisted` | Significant AI contribution |
| `blocked` | Waiting on external factor |
| `good-first-issue` | Simple, well-defined |

### Creating Good Issues

**Template:**
```markdown
## Summary
[One-line description]

## Context
[Why is this needed? Link to related issues/PRs]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Tests pass

## Technical Notes
[Optional: Implementation hints, relevant files]

## Design
[Optional: Screenshots, Figma links]
```

---

## Code Review Process

### For Authors

1. **Self-review first** — Read your own diff
2. **Write good PR descriptions:**
   ```markdown
   ## What
   [Brief description of changes]

   ## Why
   [Context and motivation]

   ## How
   [Technical approach, if non-obvious]

   ## Testing
   [How was this tested?]

   ## Screenshots
   [If UI changes]
   ```
3. **Keep PRs small** — 100-300 lines ideal, 500 max
4. **Respond to feedback** within 24 hours

### For Reviewers

1. **Review within 24 hours** of request
2. **Use Graphite's review tools** for stack navigation
3. **Comment categories:**
   - `nit:` — Optional style suggestion
   - `question:` — Need clarification
   - `suggestion:` — Recommended change
   - `blocker:` — Must fix before merge
4. **Approve stack bottom-up** when possible

### Merge Strategy

- **Squash merge** for feature branches
- Graphite handles this automatically with `gt submit --merge`

---

## Best Practices

### Copilot Tips

#### Maximize Context
```
✅ Good: "Following the pattern in @catalog.ts, create a VendorService 
   that uses Effect.js for error handling"

❌ Bad: "Create a vendor service"
```

#### Be Specific About Constraints
```
✅ Good: "Add validation that price must be positive (> 0) and a whole 
   number (VND has no decimals). Use Effect.js Schema for validation."

❌ Bad: "Add price validation"
```

#### Ask for Explanations
```
✅ Good: "Explain why this Effect.js code uses Layer.merge instead of 
   Layer.provide, then refactor if needed"
```

#### Iterate in Small Steps
```
1. "Create the type definitions for PaymentService"
2. "Implement initiateMoMoPayment method"
3. "Add error handling with typed PaymentError"
4. "Write unit tests for the happy path"
5. "Add tests for error cases"
```

### Managing Copilot Quota

With **300 premium requests/month**, optimize usage:

1. **Use standard completions** for simple edits
2. **Save Agent mode** for complex, multi-file changes
3. **Batch related questions** in one chat session
4. **Use subagents** for research (they're efficient)
5. **Track usage** in GitHub settings

### Working with Effect.js

```typescript
// ✅ DO: Use Effect.gen for readability
const program = Effect.gen(function* (_) {
  const config = yield* _(ConfigService);
  const db = yield* _(DatabaseService);
  return yield* _(db.query("products"));
});

// ❌ DON'T: Deep pipe chains for complex logic
const program = pipe(
  ConfigService,
  Effect.flatMap(config => 
    pipe(
      DatabaseService,
      Effect.flatMap(db => db.query("products"))
    )
  )
);

// ✅ DO: Type your errors explicitly
class ProductNotFoundError extends Data.TaggedError("ProductNotFoundError")<{
  productId: string;
}> {}

// ✅ DO: Use Layers for dependency injection
const live = Effect.provide(program, 
  Layer.mergeAll(ConfigServiceLive, DatabaseServiceLive)
);
```

### Git Hygiene

```bash
# Before starting work
gt sync

# Commit frequently (small commits)
git add -p  # Stage hunks interactively
gt modify   # Amend current branch

# Keep stack healthy
gt restack  # After any conflict resolution

# Clean up merged branches
gt clean
```

### Testing Strategy

```
Unit Tests (Vitest)
├── Services (Effect.js)
│   └── Mock dependencies with Layer
├── Utils
│   └── Pure functions, no mocks needed
└── Components
    └── React Testing Library

Integration Tests (Convex Test)
├── Queries
├── Mutations
└── Actions

E2E Tests (Playwright)
├── Critical user flows only
└── Run in CI, not locally
```

---

## Quick Reference

### Daily Workflow

```bash
# Morning: Sync and check Linear
gt sync
open https://linear.app/comoi

# Start work: Pick issue, create branch
gt create -m "feat(scope): description"

# During work: Iterate with Copilot
# ... code with AI assistance ...
pnpm check  # Verify after each change

# End of feature: Submit PR
gt submit

# After review: Merge and clean
gt submit --merge
gt clean
```

### Useful Aliases

Add to your shell config (`~/.zshrc`):

```bash
# Graphite
alias gs="gt sync"
alias gl="gt log"
alias gc="gt create -m"
alias gm="gt modify"
alias gsub="gt submit"

# Project
alias check="pnpm check"
alias dev="pnpm dev"
alias test="pnpm test"
```

### Getting Help

- **Copilot Chat:** `Cmd+Shift+I`
- **Graphite Docs:** https://docs.graphite.dev
- **Linear Docs:** https://linear.app/docs
- **Effect.js Docs:** https://effect.website
- **Convex Docs:** https://docs.convex.dev

---

## Appendix: VS Code Settings

Recommended workspace settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "github.copilot.enable": {
    "*": true
  },
  "github.copilot.editor.enableAutoCompletions": true,
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

*Last updated: January 2026*

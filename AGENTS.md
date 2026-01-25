# Project Summary: Comoi

## Overview
**Comoi** is a consumer-facing **grocery marketplace app** for **Southeast Asia**, with an initial focus on **Vietnam**.

The platform connects consumers with nearby **local mini-markets**, enabling price transparency and convenient ordering in markets that are traditionally offline and fragmented.

---

## Core Problem
Local mini-markets in SEA are typically:
- Fragmented and highly localized
- Price-intransparent
- Offline-first and low-tech
- Difficult to compare or order from digitally

Consumers want:
- Clear price comparison across nearby markets
- Convenient pickup or delivery options
- A simple, mobile-first user experience

---

## Product Scope

### Platforms
- Web application (initial)
- Mobile applications (iOS / Android)

### User Types
1. **Consumers**
   - Browse products from nearby mini-markets
   - Compare prices between stores
   - Place orders for pickup or delivery

2. **Vendors (Mini-markets)**
   - Manage product catalog and pricing
   - Receive and fulfill orders
   - Update availability and stock levels (manually or semi-automated)

---

## Core Features

### Consumer Features
- Location-based market discovery
- Product search and category browsing
- Price comparison across multiple markets
- Shopping cart with multi-vendor support
- Pickup or delivery selection
- Order status tracking and notifications

### Vendor Features
- Simple catalog and price management
- Order intake and status updates
- Lightweight inventory adjustments  
  (not intended to be a full ERP system, but maybe in the future)

---

## Key Constraints & Assumptions
- Vendors are small, local, and often low-tech
- Inventory and pricing data may be:
  - Incomplete
  - Slightly outdated
  - Manually maintained
- The system must tolerate **eventual consistency**
- Mobile connectivity can be unreliable
- Payments may initially rely on:
  - Cash on delivery
  - Local digital wallets

---

## Non-Goals (MVP)
- Real-time warehouse-level inventory
- Complex supply-chain or route optimization
- Cross-city or inter-region logistics
- Advanced vendor analytics or forecasting

---

## Initial Geography
- Launch market: **Vietnam**
- Designed for expansion to other SEA countries:
  - Singapore
  - Thailand
  - Indonesia
  - Philippines
  - Malaysia

---

## Technical Expectations
- Mobile-first UX
- Offline-tolerant client behavior
- Scalable to thousands of small vendors
- Strong emphasis on:
  - Developer experience
  - Clear domain boundaries
  - Long-term extensibility (payments, promotions, loyalty)

---

## Open Architecture Questions
- Monolith vs modular monolith vs microservices
- Data modeling:
  - Products vs offers vs vendors
- Handling stale pricing and user trust
- Search and geospatial querying strategy
- Order splitting and fulfillment across vendors
- Low-friction vendor onboarding

## Architecture Decisions (Final)
- **Next.js 16+** with App Router for Web-Frontend and API layer
- **Effect.js** for type-safe error handling, dependency injection, and business logic composition
- **Convex** for database, real-time sync, and backend functions
- **Clerk** for authentication (Email/Password, OAuth, Passkeys, 2FA)
- **React Native + Expo 54** for Mobile Apps
- **Convex Optimistic Updates** for offline-tolerance (no WatermelonDB needed for MVP)
- **Testing** with Playwright (E2E), Vitest (unit/integration), Convex Test
- **Turborepo** for monorepo management
- **Bun** as package manager and runtime
- **Biome** for linting and formatting
- **ESLint** for additional code quality checks
- **TypeScript 5.9+** for all layers
- **CI/CD** with GitHub Actions
- **Renovate** for automated dependency updates
- **Infrastructure** on Vercel (Next.js) + Convex Cloud
- **Payment integration**: MoMo + VNPay + PayOS (COD fallback)
- **Messaging**: Zalo OA + ZNS for vendor communication
- **i18n**: i18next + react-i18next
- **Maps**: Google Maps Platform
- **Vendor Dashboard**: Merged into web app (route-based separation at /vendor/*)

---

## Project Setup Status ✅

**Phase 1 - Week 1**: Project Foundation Complete

### Monorepo Structure
```
comoi/
├── apps/
│   ├── web/        # Next.js 16 consumer + vendor web app
│   └── mobile/     # Expo 54 React Native app
├── packages/
│   ├── convex/            # Convex backend (schema, functions, auth)
│   ├── shared/            # Shared types, utils, constants
│   ├── ui/                # Shared UI components
│   ├── eslint-config/     # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
└── .github/
    └── workflows/         # CI/CD pipelines
```

### Key Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| Bun | 1.3.6 | Package manager & runtime |
| Turborepo | 2.7.5 | Monorepo build system |
| TypeScript | 5.9.3 | Type safety |
| Biome | 2.3.12 | Linting & formatting |
| Next.js | 16.1.4 | Web framework |
| Expo | 54.0.32 | Mobile framework |
| Convex | 1.31.6 | Backend & database |
| Clerk | 6.36+ | Authentication |
| Effect | 3.19.15 | Business logic composition |
| Vitest | 4.0.18 | Unit testing |
| React | 19.2.3 | UI library |

### Scripts
```bash
bun run dev        # Start all apps in development
bun run build      # Build all packages and apps
bun run lint       # Run Biome + ESLint
bun run format     # Format with Biome
bun run typecheck  # TypeScript type checking
bun run test       # Run all tests
bun run check      # Run lint + typecheck + test
```

---

## Expected Output from the Planning Phase ✅

**Status**: Complete - See [PLAN.md](PLAN.md)

The plan provides:
- ✅ High-level system architecture with Convex + Effect.js
- ✅ Recommended tech stack (full detail)
- ✅ Core data model (Convex schema)
- ✅ Key trade-offs and risks
- ✅ MVP-first implementation strategy (24-week roadmap)
- ✅ Payment integration strategy (MoMo, VNPay, PayOS)
- ✅ Vendor onboarding approach (Zalo-first)
- ✅ Offline strategy (Convex optimistic updates)
- ✅ Effect.js architecture patterns
- ✅ Testing strategy

**Key Decisions Made**:
1. **Convex over Supabase** - Better TypeScript DX, automatic reactivity, built-in sync
2. **Full Effect.js adoption** - Learning goal, type-safe errors, DI
3. **No WatermelonDB for MVP** - Convex optimistic updates sufficient for grocery shopping use case
4. **Modular monolith** - Faster MVP, can split later if needed
5. **Zalo-first vendor approach** - Market fit for Vietnam

**Current Phase**: Phase 1 - Foundation (Weeks 1-4)
- ✅ Week 1: Monorepo setup with Turborepo
- ⏳ Weeks 2-4: Convex schema, Effect.js services, core services

---

## AI-Assisted Development Workflow

This project uses **AI-first development** with GitHub Copilot, Graphite (stacked diffs), and Linear (project management).

See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete workflow guide.

### Quick Reference for AI Agents

#### Context Files to Reference
When starting a new session, provide these files for context:
- `AGENTS.md` — Project overview and decisions
- `PLAN.md` — Detailed architecture and data models
- `CONTRIBUTING.md` — Development workflow and conventions

#### Effect.js Patterns
```typescript
// Always use Effect.gen for readability
const program = Effect.gen(function* (_) {
  const service = yield* _(MyService);
  return yield* _(service.doSomething());
});

// Type errors explicitly
class MyError extends Data.TaggedError("MyError")<{
  reason: "NOT_FOUND" | "INVALID";
}> {}

// Use Layers for DI
const live = Effect.provide(program, MyServiceLive);
```

#### Convex Patterns
```typescript
// Queries and mutations
export const myQuery = query({
  args: { id: v.id("table") },
  handler: async (ctx, args) => {
    // Use Effect for business logic
    const program = Effect.gen(function* (_) {
      // ...
    });
    return Effect.runPromise(program);
  }
});
```

#### Commit Messages
Use Conventional Commits:
- `feat(scope): description` — New feature
- `fix(scope): description` — Bug fix
- `refactor(scope): description` — Code change
- `test(scope): description` — Tests
- `docs(scope): description` — Documentation

#### Project Links
- **GitHub**: https://github.com/sebkasanzew/comoi
- **Linear**: https://linear.app/comoi
- **Graphite**: Use `gt` CLI for stacked diffs
